import {
  createStore,
  createEffect,
  createEvent,
  sample,
  merge,
} from "effector";
import { Commit, LogOptions, log as logGit } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

import { $runCommandOptions } from "../../config";
import { createCommit } from "../events";
import { commit } from "../effects";
import { checkout } from "../../current-branch";
import { rebaseEnd } from "../../rebase";
import { pullEnd } from "../../pull";

export { Commit } from "lib/api-git";

export const $logOriginal = createStore<Map<string, Commit>>(new Map());

export const addChunkLog = createEvent<{
  chunk: Map<string, Commit>;
  index: number;
}>();

export const log = createEffect<LogOptions, void>({
  handler: async (options) => {
    const logPipe = logGit(options).next((chunk, index) =>
      addChunkLog({ chunk, index }),
    );

    await pipeToPromise(logPipe);
  },
});

sample({
  source: $runCommandOptions,
  clock: createCommit,
  fn: (options, message) => ({
    ...options,
    message,
  }),
  target: commit,
});

sample({
  source: $runCommandOptions,
  clock: merge([
    $runCommandOptions,
    commit.done,
    checkout.done,
    rebaseEnd,
    pullEnd,
  ]),
  target: log,
});

$logOriginal.on(addChunkLog, (store, { chunk, index }) => {
  if (index) {
    return new Map([...store, ...chunk]);
  }
  return chunk;
});
