import { createStore, createEffect, forward } from "effector";

import { showRef, showRefSync, Refs, Ref } from "../api-git";
import { $baseOptions } from "./config";

const toArr = (refs: Refs): Ref[] => {
  return Array.from(refs.values());
};

const onlyBranches = (refs: Refs): Ref[] => {
  return toArr(refs).filter(ref => {
    return ref.type === "heads";
  });
};

const byCommitHash = (refs: Refs): Map<string, Ref[]> => {
  return toArr(refs).reduce((memo, ref) => {
    if (!memo.has(ref.hash)) {
      memo.set(ref.hash, []);
    }
    memo.get(ref.hash).push(ref);
    return memo;
  }, new Map());
};

const defaultRefs = showRefSync($baseOptions.getState());
const defaultRefsOnlyBranches = onlyBranches(defaultRefs);
const defaultRefsByCommitHash = byCommitHash(defaultRefs);

export const $refs = createStore<Refs>(defaultRefs);
export const $refsOnlyBranches = createStore<Ref[]>(defaultRefsOnlyBranches);
export const $refsByCommitHash = createStore<Map<string, Ref[]>>(
  defaultRefsByCommitHash
);

const updateRefs = createEffect<void, Refs>({
  handler: () => showRef($baseOptions.getState())
});

forward({ from: $baseOptions, to: updateRefs });

$refs.on(updateRefs.done, (_, { result }) => result);

$refsOnlyBranches.on($refs, (_, refs) => onlyBranches(refs));

$refsByCommitHash.on($refs, (_, refs) => byCommitHash(refs));
