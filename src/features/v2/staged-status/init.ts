import { forward, sample, guard, merge } from "effector";
import { $status, getStatusS } from "features/v2/status";
import { createDependRunCommandOptions } from "features/v2/settings/model";
import { toDiffFiles, createPatchByChunk, createPatchByLine } from "lib/diff";

import * as model from "./model";

sample({
  source: model.$stagedStatus,
  clock: $status,
  fn: (stagedStatus) =>
    Array.from(stagedStatus.ref.values())
      .filter(({ diff }) => !!diff)
      .map(({ path }) => path),
}).watch((paths) => {
  paths.forEach((path) => model.getDiff(path));
});

sample({
  source: model.$stagedStatus,
  clock: $status,
  fn: (stagedStatus, status) => {
    return status
      .filter(({ stage }) => stage !== " " && stage !== "?")
      .reduce(
        (memo, statusFile) => {
          const stagedStatusFile = stagedStatus.ref.get(statusFile.path);

          memo.ref.set(statusFile.path, {
            ...statusFile,
            diff: stagedStatusFile ? stagedStatusFile.diff : null,
          });

          return memo;
        },
        { ref: new Map() },
      );
  },
  target: model.$stagedStatus,
});

createDependRunCommandOptions({
  event: model.unstageChanges.map(({ path }) => ({ paths: [path] })),
  effect: model.unstage,
});

createDependRunCommandOptions({
  event: sample(model.$stagedStatus, model.unstageAllChanges).map((status) => ({
    paths: Array.from(status.ref.keys()),
  })),
  effect: model.unstage,
});

const statusFileByGetDiff = sample({
  source: model.$stagedStatus,
  clock: model.showDiff,
  fn: ({ ref }, path) =>
    ref.get(path) || { path: "", stage: "", unstage: "", diff: null },
});

const addDiff = guard({
  source: statusFileByGetDiff,
  filter: (statusFile) => !!statusFile && statusFile.diff === null,
}).map((statusFile) => statusFile.path);

forward({
  from: addDiff,
  to: model.getDiff,
});

createDependRunCommandOptions({
  event: model.getDiff,
  effect: model.diff,
});

forward({
  from: merge([
    model.unstage.done,
    model.stageByPatchChunk.done,
    model.stageByPatchLine.done,
  ]),
  to: getStatusS,
});

// createDependRunCommandOptions({
//   event: model.createPatchByChunk.map((diffChunk) => ({
//     patch: createPatchByChunk(diffChunk, true),
//   })),
//   effect: model.stageByPatchChunk,
// });

// createDependRunCommandOptions({
//   event: model.createPatchByLine.map((diffLine) => ({
//     patch: createPatchByLine(diffLine, true),
//   })),
//   effect: model.stageByPatchLine,
// });

sample({
  source: model.$stagedStatus,
  clock: model.diff.done,
  fn: (store, { result }) => {
    const diffFiles = toDiffFiles(result);

    if (diffFiles.length) {
      diffFiles.forEach((diffFile) => {
        const statusFile = store.ref.get(diffFile.path);

        if (statusFile) {
          statusFile.diff = diffFile;
        }
      });

      return { ref: store.ref };
    }

    return store;
  },
  target: model.$stagedStatus,
});

sample({
  source: model.$stagedStatus,
  clock: model.hideDiff,
  fn: (store, path) => {
    const statusFile = store.ref.get(path);

    if (statusFile) {
      statusFile.diff = null;

      return { ref: store.ref };
    }

    return store;
  },
  target: model.$stagedStatus,
});
