import { createStore } from "effector";
import { DiffFile, DiffLine } from "lib/api-git";

import { diff } from "../effects";
import { removeDiffFile } from "../events";

export const $diffFiles = createStore<{
  ref: Map<string, DiffFile<DiffLine[]>>;
}>({
  ref: new Map(),
});

$diffFiles.on(diff.done, (store, { result, params }) => {
  if (!params.cached) {
    result.forEach((diffFiles) => {
      diffFiles.forEach((diffFile, key) => store.ref.set(key, diffFile));
    });

    return { ref: store.ref };
  }

  return store;
});
$diffFiles.on(removeDiffFile, (store, { path, cached }) => {
  if (!cached && store.ref.has(path)) {
    store.ref.delete(path);

    return { ref: store.ref };
  }

  return store;
});
