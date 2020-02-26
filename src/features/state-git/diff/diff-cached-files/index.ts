import { createStore } from "effector";
import { DiffFile, DiffLine } from "lib/api-git";

import { removeDiffFile } from "../events";
import { diff } from "../effects";

export const $diffCachedFiles = createStore<{
  ref: Map<string, DiffFile<DiffLine[]>>;
}>({
  ref: new Map(),
});

$diffCachedFiles.on(diff.done, (store, { result, params }) => {
  if (params.cached) {
    result.forEach((diffFiles) => {
      diffFiles.forEach((diffFile, key) => store.ref.set(key, diffFile));
    });

    return { ref: store.ref };
  }

  return store;
});
$diffCachedFiles.on(removeDiffFile, (store, { path, cached }) => {
  if (cached && store.ref.has(path)) {
    store.ref.delete(path);

    return { ref: store.ref };
  }

  return store;
});
