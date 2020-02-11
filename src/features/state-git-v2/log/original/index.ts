import {
  createStore,
  createEffect,
  createEvent,
  sample,
  merge,
} from "effector";
import { Commit, LogOptions, log as logGit } from "lib/api-git-v2";

import { $runCommandOptions } from "../../config";
import { createCommit } from "../events";
import { commit } from "../effects";
import { checkout } from "../../current-branch";

export { Commit } from "lib/api-git-v2";

export const $logOriginal = createStore<Map<string, Commit>>(new Map());

export const addChunkLog = createEvent<{
  chunk: Map<string, Commit>;
  index: number;
}>();

export const log = createEffect<LogOptions, void>({
  handler: async (options) => {
    logGit(options).next((chunk, index) => addChunkLog({ chunk, index }));
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
  clock: merge([$runCommandOptions, commit.done, checkout.done]),
  target: log,
});

$logOriginal.on(addChunkLog, (store, { chunk, index }) => {
  if (index) {
    return new Map([...store, ...chunk]);
  }
  return chunk;
});
