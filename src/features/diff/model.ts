import { createStore, createEffect, createEvent, sample } from "effector";
import { DiffFile, DiffLine, diff as diffGit, DiffOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

import { $runCommandOptions, refreshStatus } from "features/state-git";

interface DiffFileParams {
  path: string;
  cached?: boolean;
}

export const $diffFiles = createStore<{
  ref: Map<string, DiffFile<DiffLine[]>>;
}>({
  ref: new Map(),
});
export const $diffCachedFiles = createStore<{
  ref: Map<string, DiffFile<DiffLine[]>>;
}>({
  ref: new Map(),
});
export const $diffFilesParams = createStore<Map<string, DiffFileParams>>(
  new Map(),
);

export const getDiffFile = createEvent<DiffFileParams>();
export const removeDiffFile = createEvent<DiffFileParams>();

const diff = createEffect<DiffOptions, Map<string, DiffFile<DiffLine[]>>[]>({
  handler: (options) => pipeToPromise(diffGit(options)),
});

const updateDiff = createEffect<Map<string, DiffFileParams>, void>({
  handler: async (params) => {
    params.forEach((getDiffFileParams) => getDiffFile(getDiffFileParams));
  },
});

sample({
  source: $runCommandOptions,
  clock: getDiffFile,
  fn: (options, { path, cached }) => ({
    ...options,
    paths: [path],
    cached,
  }),
  target: diff,
});

sample({
  source: $diffFilesParams,
  clock: refreshStatus,
  target: updateDiff,
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

$diffFilesParams.on(getDiffFile, (store, params) => {
  store.set(`${params.path}-${Boolean(params.cached)}`, params);

  return store;
});
$diffFilesParams.on(removeDiffFile, (store, params) => {
  store.delete(`${params.path}-${Boolean(params.cached)}`);

  return store;
});
