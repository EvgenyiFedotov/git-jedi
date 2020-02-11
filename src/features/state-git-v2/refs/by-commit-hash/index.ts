import { createStore } from "effector";

import { addChunkRefs, Ref } from "../original";

export const $refsByCommitHash = createStore<Map<string, Ref[]>>(new Map());

$refsByCommitHash.on(addChunkRefs, (store, { chunk, index }) => {
  if (index) {
    return byCommitHash(chunk, store);
  }
  return byCommitHash(chunk);
});

function byCommitHash(
  refs: Map<string, Ref>,
  prev: Map<string, Ref[]> = new Map(),
): Map<string, Ref[]> {
  return Array.from(refs.values()).reduce((memo, ref) => {
    if (!memo.has(ref.hash)) {
      memo.set(ref.hash, []);
    }
    const item = memo.get(ref.hash);
    if (item) {
      item.push(ref);
    }
    return memo;
  }, prev);
}
