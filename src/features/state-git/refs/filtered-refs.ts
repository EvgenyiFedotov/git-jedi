import { combine } from "effector";
import { Ref, Refs } from "lib/api-git";

import { $originalRefs } from "./original-refs";

export const $onlyBranchRefs = combine($originalRefs, (originalRefs) =>
  onlyBranches(originalRefs),
);
export const $byCommitHashRefs = combine($originalRefs, (originalRefs) =>
  byCommitHash(originalRefs),
);

function onlyBranches(refs: Refs): Ref[] {
  return Array.from(refs.values()).filter((ref) => {
    return ref.type === "heads";
  });
}

function byCommitHash(refs: Refs): Map<string, Ref[]> {
  return Array.from(refs.values()).reduce((memo, ref) => {
    if (!memo.has(ref.hash)) {
      memo.set(ref.hash, []);
    }
    memo.get(ref.hash).push(ref);
    return memo;
  }, new Map());
}
