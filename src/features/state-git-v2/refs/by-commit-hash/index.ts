import { createStore } from "effector";

import { addChunkRefs, Ref } from "../original";

export const $refsByCommitHash = createStore<Map<string, Ref>>(new Map());

$refsByCommitHash.on(addChunkRefs, (store, { chunk, index }) => {
  if (index) {
    return new Map([...store, ...byCommitHash(chunk)]);
  }
  return byCommitHash(chunk);
});

function byCommitHash(refs: Map<string, Ref>): Map<string, Ref> {
  return Array.from(refs.values()).reduce((memo, ref) => {
    if (!memo.has(ref.hash)) {
      memo.set(ref.hash, []);
    }
    memo.get(ref.hash).push(ref);
    return memo;
  }, new Map());
}
