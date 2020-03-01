import { createStore } from "effector";

import { addChunkRefs, Ref } from "../original";

export const $refsOnlyBranches = createStore<Map<string, Ref>>(new Map());

$refsOnlyBranches.on(addChunkRefs, (store, { chunk, index }) => {
  if (index) {
    return new Map([...store, ...onlyBranches(chunk)]);
  }

  return onlyBranches(chunk);
});

function onlyBranches(refs: Map<string, Ref>): Map<string, Ref> {
  return Array.from(refs.values()).reduce((memo, ref) => {
    if (ref.type === "heads") {
      memo.set(ref.name, ref);
    }
    return memo;
  }, new Map());
}
