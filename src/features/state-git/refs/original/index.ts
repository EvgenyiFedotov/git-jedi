import {
  createStore,
  createEffect,
  createEvent,
  sample,
  merge,
} from "effector";
import { showRef as showRefGit, ShowRefOptions, Ref } from "lib/api-git";

import { $runCommandOptions } from "../../config";
import { commit } from "../../log";
import { checkout } from "../../current-branch";
import { rebaseEnd } from "../../rebase";

export { Ref } from "lib/api-git";

export const $refsOriginal = createStore<Map<string, Ref>>(new Map());

export const showRef = createEffect<ShowRefOptions, void>({
  handler: async (options) => {
    showRefGit(options).next((chunk, index) => addChunkRefs({ chunk, index }));
  },
});

export const addChunkRefs = createEvent<{
  chunk: Map<string, Ref>;
  index: number;
}>();

sample({
  source: $runCommandOptions,
  clock: merge([$runCommandOptions, commit.done, checkout.done, rebaseEnd]),
  target: showRef,
});

$refsOriginal.on(addChunkRefs, (store, { chunk, index }) => {
  if (index) {
    return new Map([...store, ...chunk]);
  }
  return chunk;
});
