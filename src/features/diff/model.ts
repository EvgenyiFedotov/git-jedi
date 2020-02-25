import {
  createStore,
  createEffect,
  createEvent,
  sample,
  forward,
} from "effector";
import {
  DiffFile,
  DiffLine,
  diff as diffGit,
  DiffOptions,
  DiffFileChunk,
  DiffChunkHeader,
} from "lib/api-git";
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
export const stageChunk = createEvent<{
  chunk: DiffFileChunk<DiffLine[]>;
  diffFile: DiffFile<DiffLine[]>;
}>();

const diff = createEffect<DiffOptions, Map<string, DiffFile<DiffLine[]>>[]>({
  handler: (options) => pipeToPromise(diffGit(options)),
});

const updateDiff = createEffect<Map<string, DiffFileParams>, void>({
  handler: async (params) => {
    params.forEach((getDiffFileParams) => getDiffFile(getDiffFileParams));
  },
});

const createPatchByChunk = createEffect<
  { chunk: DiffFileChunk<DiffLine[]>; diffFile: DiffFile<DiffLine[]> },
  string
>({
  handler: async ({ chunk, diffFile }) => {
    let lines: string[] = [];
    let removeLines: string[] = [];
    let addLines: string[] = [];

    for (let index = 0; index < chunk.lines.length; index += 1) {
      const line = chunk.lines[index];

      if (line.changed) {
        if (line.remove) {
          removeLines.push(`-${line.remove}`);
        }
        if (line.add) {
          addLines.push(`+${line.add}`);
        }
      } else {
        if (removeLines.length) {
          lines = [...lines, ...removeLines];
          removeLines = [];
        }
        if (addLines.length) {
          lines = [...lines, ...addLines];
          addLines = [];
        }
        lines.push(` ${line.remove}` || " ");
      }
    }

    const result = [
      `diff --git ${diffFile.info.pathA} ${diffFile.info.pathB}`,
      diffFile.info.meta,
      ...diffFile.info.legend,
      getHeaderChunk(chunk.header),
      ...lines,
    ];

    return result.join("\n");
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

forward({ from: stageChunk, to: createPatchByChunk });

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

export const getHeaderChunk = (diffHeader: DiffChunkHeader) => {
  const { meta, title } = diffHeader;
  const { remove, add } = meta;

  return `@@ -${remove.from},${remove.length} +${add.from},${add.length} @@ ${title}`;
};
