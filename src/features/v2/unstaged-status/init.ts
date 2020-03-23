import { sample, forward, merge, guard } from "effector";
import { $status, getStatusS } from "features/v2/status/model";
import { createDependRunCommandOptions } from "features/v2/settings";
import { parseResult } from "lib/diff";
import * as fs from "fs";

import {
  $unstagedStatus,
  stageChanges,
  stage,
  discard,
  discardChanges,
  $discardingChanges,
  discardAllChanges,
  stageAllChanges,
  diff,
  createPatchByLine,
} from "./model";
import * as model from "./model";

const updateDiffs = sample({
  source: $unstagedStatus,
  clock: $status,
  fn: (unstagedStatus) =>
    Array.from(unstagedStatus.ref.values())
      .filter(({ diff }) => !!diff)
      .map(({ path }) => path),
});

updateDiffs.watch((paths) => paths.forEach((path) => model.getDiff(path)));

$unstagedStatus.on($status, (store, status) => ({
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
  source: model.$unstagedStatus,
  clock: merge([model.showDiff, model.getDiff]).map<string>((value) => value),
  fn: ({ ref }, path) =>
    ref.get(path) || {
      path: "",
      stage: "",
      unstage: "",
      diff: null,
    },
});

createDependRunCommandOptions({
  event: statusFileByGetDiff,
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
$unstagedStatus.on(model.hideDiff, (store, path) => {
  const statusFile = store.ref.get(path);

  if (statusFile) {
    statusFile.diff = null;

    return { ref: store.ref };
  }

  return store;
});

model.connector.watch(({ message }) => {
  const [, , path] = message.paths;

  model.editAddEditPatch({ path });
});

forward({
  from: model.createPatchByChunk.map((diffChunk) => {
    let patch = diffChunk.file.info;

    patch += `\n${diffChunk.header}`;

    diffChunk.lines.forEach(({ action, line }) => {
      const strAction = action ? (action === "removed" ? "-" : "+") : " ";

      patch += `\n${strAction}${line}`;
    });

    patch += "\n";

    return patch;
  }),
  to: model.$patchByChunk,
});

createDependRunCommandOptions({
  event: guard({
    source: model.$patchByChunk,
    filter: (patch) => !!patch,
  }).map(() => {}),
  effect: model.stageByPatch,
});

sample({
  source: model.$patchByChunk,
  clock: model.editAddEditPatch,
  fn: (patch, { path }) => ({ patch, path }),
}).watch(({ patch, path }) => {
  fs.writeFile(path, patch, () => {
    model.connector.send({ success: true });
  });
});

forward({
  from: createPatchByLine.map((diffLine) => {
    let patch = diffLine.chunk.file.info;

    patch += `\n${diffLine.chunk.header}`;

    diffLine.chunk.lines.forEach(({ id, action, line }) => {
      if (action === null || id === diffLine.id || action === "removed") {
        let strAction = " ";

        if (id === diffLine.id) {
          strAction = action ? (action === "removed" ? "-" : "+") : " ";
        }

        patch += `\n${strAction}${line}`;
      }
    });

    patch += "\n";

    return patch;
  }),
  to: model.$patchByLine,
});

createDependRunCommandOptions({
  event: guard({
    source: model.$patchByLine,
    filter: (patch) => !!patch,
  }).map(() => {}),
  effect: model.stageByPatch,
});

sample({
  source: model.$patchByLine,
  clock: model.editAddEditPatch,
  fn: (patch, { path }) => ({ patch, path }),
}).watch(({ patch, path }) => {
  fs.writeFile(path, patch, () => {
    model.connector.send({ success: true });
  });
});

forward({
  from: model.stageByPatch.done,
  to: getStatusS,
});

model.$patchByChunk.on(model.stageByPatch.done, () => "");

model.$patchByLine.on(model.stageByPatch.done, () => "");
