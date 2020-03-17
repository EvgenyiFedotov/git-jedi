import { forward, sample, guard } from "effector";
import { $status } from "features/v2/status";
import { createDependRunCommandOptions } from "features/v2/settings/model";
import { parseResult } from "lib/diff";

import {
  $stagedStatus,
  unstage,
  unstageChanges,
  unstageAllChanges,
  getDiff,
  diff,
} from "./model";

forward({
  from: $status.map((status) =>
    status
      .filter(({ unstage }) => unstage === " ")
      .reduce(
        (memo, statusFile) => {
          memo.ref.set(statusFile.path, { ...statusFile, diff: null });

          return memo;
        },
        { ref: new Map() },
      ),
  ),
  to: $stagedStatus,
});

createDependRunCommandOptions({
  event: unstageChanges.map(({ path }) => ({ paths: [path] })),
  effect: unstage,
});

createDependRunCommandOptions({
  event: sample($stagedStatus, unstageAllChanges).map((status) => ({
    paths: Array.from(status.ref.keys()),
  })),
  effect: unstage,
});

const statusFileByGetDiff = sample({
  source: $stagedStatus,
  clock: getDiff,
  fn: ({ ref }, path) =>
    ref.get(path) || { path: "", stage: "", unstage: "", diff: null },
});

const addDiff = guard({
  source: statusFileByGetDiff,
  filter: (statusFile) => !!statusFile && statusFile.diff === null,
}).map((statusFile) => statusFile.path);

const removeDiff = guard({
  source: statusFileByGetDiff,
  filter: (statusFile) => !!statusFile && statusFile.diff !== null,
}).map((statusFile) => statusFile.path);

createDependRunCommandOptions({
  event: addDiff,
  effect: diff,
});

$stagedStatus.on(diff.done, (store, { result }) => {
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
$stagedStatus.on(removeDiff, (store, path) => {
  const statusFile = store.ref.get(path);

  if (statusFile) {
    statusFile.diff = null;

    return { ref: store.ref };
  }

  return store;
});
