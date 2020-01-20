import { createStore, createEffect, forward } from "effector";

import { showRef, showRefSync, Refs, Ref } from "../api-git";
import { $baseOptions } from "./config";

export const $refs = createStore<Refs>(showRefSync($baseOptions.getState()));

export const byCommitHash = (refs: Refs): Map<string, Ref[]> => {
  return Array.from(refs.values()).reduce((memo, ref) => {
    if (!memo.has(ref.hash)) {
      memo.set(ref.hash, []);
    }
    memo.get(ref.hash).push(ref);
    return memo;
  }, new Map());
};

const updateRefs = createEffect<void, Refs>({
  handler: () => showRef($baseOptions.getState())
});

forward({ from: $baseOptions, to: updateRefs });
forward({ from: updateRefs.done.map(({ result }) => result), to: $refs });
