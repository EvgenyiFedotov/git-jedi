import { forward, sample } from "effector";
import { $status } from "features/v2/status";
import { createDependRunCommandOptions } from "features/v2/settings";

import {
  $unstagedStatus,
  stageChanges,
  stage,
  discard,
  discardChanges,
  $discardingChanges,
  discardAllChanges,
  stageAllChanges,
} from "./model";

forward({
  from: $status.map((status) =>
    status.filter(
      ({ stage, unstage }) =>
        (stage === unstage && unstage === "?") || stage === " ",
    ),
  ),
  to: $unstagedStatus,
});

createDependRunCommandOptions({
  event: stageChanges.map(({ path }) => ({ paths: [path] })),
  effect: stage,
});

createDependRunCommandOptions({
  event: discardChanges.map(({ path }) => ({ paths: [path] })),
  effect: discard,
});

createDependRunCommandOptions({
  event: sample($unstagedStatus, stageAllChanges).map((status) =>
    status.reduce<{ paths: string[] }>(
      (memo, { path }) => {
        memo.paths.push(path);
        return memo;
      },
      { paths: [] },
    ),
  ),
  effect: stage,
});

createDependRunCommandOptions({
  event: sample({
    source: $unstagedStatus,
    clock: discardAllChanges,
    fn: (status) =>
      status.reduce<{ paths: string[] }>(
        (memo, { path }) => {
          memo.paths.push(path);
          return memo;
        },
        { paths: [] },
      ),
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
    if (status.length) {
      const ref = status.reduce((memo, statusFile) => {
        memo.set(statusFile.path, statusFile);

        return memo;
      }, new Map());

      return { ref };
    }

    return store;
  },
);
