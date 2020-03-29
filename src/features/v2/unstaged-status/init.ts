import { sample, forward, merge, guard } from "effector";
import { $status, getStatusS } from "features/v2/status/model";
import { createDependRunCommandOptions } from "features/v2/settings";
import { parseResult, createPatchByChunk, createPatchByLine } from "lib/diff";

import * as model from "./model";

const updateDiffs = sample({
  source: model.$unstagedStatus,
  clock: $status,
  fn: (unstagedStatus) =>
    Array.from(unstagedStatus.ref.values()).filter(({ diff }) => !!diff),
});

updateDiffs.watch((unstagedStatus) => {
  unstagedStatus.forEach((statusFile) => model.getDiff(statusFile));
});

model.$unstagedStatus.on($status, (store, status) => ({
  ref: status
    .filter(({ unstage }) => unstage !== " ")
    .reduce((memo, statusFile) => {
      const unstagedStatus = store.ref.get(statusFile.path);

      memo.set(statusFile.path, {
        ...statusFile,
        diff: unstagedStatus ? unstagedStatus.diff : null,
      });

      return memo;
    }, new Map()),
}));

createDependRunCommandOptions({
  event: model.stageChanges.map(({ path }) => ({ paths: [path] })),
  effect: model.stage,
});

createDependRunCommandOptions({
  event: model.discardChanges.map(({ path }) => ({ paths: [path] })),
  effect: model.discard,
});

createDependRunCommandOptions({
  event: sample(model.$unstagedStatus, model.stageAllChanges).map((status) => ({
    paths: Array.from(status.ref.keys()),
  })),
  effect: model.stage,
});

// Stage changes by directory
const pathsByDir = sample({
  source: model.$unstagedStatus,
  clock: model.stageChangesByDir,
  fn: (unstaged, dir) => {
    const paths = Array.from(unstaged.ref.values())
      .filter(({ path }) => {
        return path.match(dir);
      })
      .map(({ path }) => path);

    return { paths };
  },
});

createDependRunCommandOptions({
  event: pathsByDir,
  effect: model.stage,
});

createDependRunCommandOptions({
  event: sample({
    source: model.$unstagedStatus,
    clock: model.discardAllChanges,
    fn: (status) => ({
      paths: Array.from(status.ref.keys()),
    }),
  }),
  effect: model.discard,
});

model.$discardingChanges.on(model.discardChanges, (store, statusFile) => {
  const { path } = statusFile;

  if (store.ref.has(path) === false) {
    store.ref.set(path, statusFile);

    return { ref: store.ref };
  }

  return store;
});
model.$discardingChanges.on(
  model.discard.done,
  (store, { params: { params } }) => {
    const [path] = params.paths;

    if (store.ref.has(path)) {
      store.ref.delete(path);

      return { ref: store.ref };
    }

    return store;
  },
);
model.$discardingChanges.on(
  sample(model.$unstagedStatus, model.discardAllChanges),
  (store, status) => {
    if (status.ref.size) {
      const ref = Array.from(status.ref.values()).reduce((memo, statusFile) => {
        memo.set(statusFile.path, statusFile);

        return memo;
      }, new Map());

      return { ref };
    }

    return store;
  },
);

const statusFileByGetDiff = sample({
  source: model.$unstagedStatus,
  clock: model.showDiff,
  fn: ({ ref }, path) =>
    ref.get(path) || {
      path: "",
      stage: "",
      unstage: "",
      diff: null,
    },
});

const addDiff = guard({
  source: statusFileByGetDiff,
  filter: (statusFile) => !!statusFile && statusFile.diff === null,
});

forward({
  from: addDiff,
  to: model.getDiff,
});

createDependRunCommandOptions({
  event: model.getDiff,
  effect: model.diff,
});

model.$unstagedStatus.on(model.diff.done, (store, { result }) => {
  const diffFiles = parseResult(result);

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
});
model.$unstagedStatus.on(model.hideDiff, (store, path) => {
  const statusFile = store.ref.get(path);

  if (statusFile) {
    statusFile.diff = null;

    return { ref: store.ref };
  }

  return store;
});

createDependRunCommandOptions({
  event: model.createPatchByChunk.map((diffChunk) => ({
    patch: createPatchByChunk(diffChunk),
  })),
  effect: model.stageByPatchChunk,
});

createDependRunCommandOptions({
  event: model.createPatchByLine.map((diffLine) => ({
    patch: createPatchByLine(diffLine),
  })),
  effect: model.stageByPatchLine,
});

forward({
  from: merge([
    model.stage.done,
    model.discard.done,
    model.stageByPatchChunk.done,
    model.stageByPatchLine.done,
  ]),
  to: getStatusS,
});
