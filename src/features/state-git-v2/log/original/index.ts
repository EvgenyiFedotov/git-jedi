import { createStore, createEffect, createEvent, forward } from "effector";
import { Commit, LogOptions, log as logGit } from "lib/api-git-v2";

import { $runCommandOptions } from "../../config";

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

forward({
  from: $runCommandOptions,
  to: log,
});

$logOriginal.on(addChunkLog, (store, { chunk, index }) => {
  if (index) {
    return new Map([...store, ...chunk]);
  }
  return chunk;
});
