import { createStore } from "effector";

import { DiffFileParams, getDiffFile, removeDiffFile } from "../events";

export const $diffFilesParams = createStore<Map<string, DiffFileParams>>(
  new Map(),
);

$diffFilesParams.on(getDiffFile, (store, params) => {
  store.set(`${params.path}-${Boolean(params.cached)}`, params);

  return store;
});
$diffFilesParams.on(removeDiffFile, (store, params) => {
  store.delete(`${params.path}-${Boolean(params.cached)}`);

  return store;
});
