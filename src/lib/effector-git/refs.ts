import { createStore, createEffect, forward } from "effector";
import { notification } from "antd";

import { showRef, showRefSync, Refs, Ref } from "../api-git";
import { $baseOptions } from "./config";
import { creatingBranch } from "features/create-branch/model";
import { committing } from "features/log/model";
import { $currentBranch } from "./current-branch";

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

let defaultRefs;
try {
  defaultRefs = showRefSync({
    ...$baseOptions.getState(),
    onReject: () => {
      notification.info({
        message: "Create initial commit into 'master' branch",
        placement: "bottomRight",
        duration: 0
      });
    }
  });
} catch (error) {
  defaultRefs = new Map();
}

let defaultRefsOnlyBranches: Ref[];
try {
  defaultRefsOnlyBranches = onlyBranches(defaultRefs);
} catch (error) {
  defaultRefsOnlyBranches = [];
}

let defaultRefsByCommitHash;
try {
  defaultRefsByCommitHash = byCommitHash(defaultRefs);
} catch (error) {
  defaultRefsByCommitHash = new Map();
}

export const $refs = createStore<Refs>(defaultRefs);
export const $refsOnlyBranches = createStore<Ref[]>(defaultRefsOnlyBranches);
export const $refsByCommitHash = createStore<Map<string, Ref[]>>(
  defaultRefsByCommitHash
);

const updateRefs = createEffect<void, Refs>({
  handler: () => showRef($baseOptions.getState())
});

forward({ from: $baseOptions, to: updateRefs });

forward({ from: creatingBranch.done, to: updateRefs });

forward({ from: committing.done, to: updateRefs });

forward({ from: $currentBranch, to: updateRefs });

$refs.on(updateRefs.done, (_, { result }) => result);
$refs.on(updateRefs.fail, () => new Map());

$refsOnlyBranches.on($refs, (_, refs) => onlyBranches(refs));

$refsByCommitHash.on($refs, (_, refs) => byCommitHash(refs));
