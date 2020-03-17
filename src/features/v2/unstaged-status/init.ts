import { guard, sample } from "effector";
import { $status } from "features/v2/status";
import { createDependRunCommandOptions } from "features/v2/settings";
import { parseResult } from "lib/diff";

import {
  $unstagedStatus,
  stageChanges,
  stage,
  discard,
  discardChanges,
  $discardingChanges,
  discardAllChanges,
  stageAllChanges,
  getDiff,
  diff,
  createPatchByChunk,
  createPatchByLine,
} from "./model";

$unstagedStatus.on($status, (_, status) => ({
  ref: status
    .filter(({ unstage }) => unstage !== " ")
    .reduce((memo, statusFile) => {
      memo.set(statusFile.path, {
        ...statusFile,
        diff: null,
      });

      return memo;
    }, new Map()),
}));

createDependRunCommandOptions({
  event: stageChanges.map(({ path }) => ({ paths: [path] })),
  effect: stage,
});

createDependRunCommandOptions({
  event: discardChanges.map(({ path }) => ({ paths: [path] })),
  effect: discard,
});

createDependRunCommandOptions({
  event: sample($unstagedStatus, stageAllChanges).map((status) => ({
    paths: Array.from(status.ref.keys()),
  })),
  effect: stage,
});

createDependRunCommandOptions({
  event: sample({
    source: $unstagedStatus,
    clock: discardAllChanges,
    fn: (status) => ({
      paths: Array.from(status.ref.keys()),
    }),
  }),
  effect: discard,
});

$discardingChanges.on(discardChanges, (store, statusFile) => {
  const { path } = statusFile;

  if (store.ref.has(path) === false) {
    store.ref.set(path, statusFile);

    return { ref: store.ref };
  }

  return store;
});
$discardingChanges.on(discard.done, (store, { params: { params } }) => {
  const [path] = params.paths;

  if (store.ref.has(path)) {
    store.ref.delete(path);

    return { ref: store.ref };
  }

  return store;
});
$discardingChanges.on(
  sample($unstagedStatus, discardAllChanges),
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
  source: $unstagedStatus,
  clock: getDiff,
  fn: ({ ref }, path) =>
    ref.get(path) || { path: "", stage: "", unstage: "", diff: null },
});

const addDiff = guard({
  source: statusFileByGetDiff,
  filter: (statusFile) => !!statusFile && statusFile.diff === null,
});

const removeDiff = guard({
  source: statusFileByGetDiff,
  filter: (statusFile) => !!statusFile && statusFile.diff !== null,
});

createDependRunCommandOptions({
  event: addDiff,
  effect: diff,
});

$unstagedStatus.on(diff.done, (store, { result }) => {
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
$unstagedStatus.on(removeDiff, (store, { path }) => {
  const statusFile = store.ref.get(path);

  if (statusFile) {
    statusFile.diff = null;

    return { ref: store.ref };
  }

  return store;
});

const patchByChunk = createPatchByChunk.map((diffChunk) => {
  let result = diffChunk.file.info;

  result += `\n${diffChunk.header}`;

  diffChunk.lines.forEach(({ action, line }) => {
    const strAction = action ? (action === "removed" ? "-" : "+") : " ";

    result += `\n${strAction}${line}`;
  });

  return result;
});

const patchByLine = createPatchByLine.map((diffLine) => {
  let result = diffLine.chunk.file.info;

  result += `\n${diffLine.chunk.header}`;

  diffLine.chunk.lines.forEach(({ id, action, line }) => {
    if (action === null || id === diffLine.id || action === "removed") {
      let strAction = " ";

      if (id === diffLine.id) {
        strAction = action ? (action === "removed" ? "-" : "+") : " ";
      }

      result += `\n${strAction}${line}`;
    }
  });

  return result;
});
