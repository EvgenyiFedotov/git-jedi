import { createStore, createEffect, forward, sample } from "effector";
import { defaultRun } from "lib/default-run";
import { showRef, showRefSync, Refs, ShowRefOptions } from "lib/api-git";

import { $baseOptions } from "../config";
import { createInitCommit } from "./notifications";
import { $currentBranch } from "../current-branch";

const baseOptions = $baseOptions.getState();
const defRefs = defaultRun(
  () =>
    showRefSync({
      ...baseOptions,
      onReject: createInitCommit,
    }),
  new Map(),
);
export const $originalRefs = createStore<Refs>(defRefs);

export const updateRefs = createEffect<ShowRefOptions, Refs>({
  handler: (options) => showRef(options),
});

forward({ from: $baseOptions, to: updateRefs });

// TODO ?After create branch

// TODO After create commit

sample({ source: $baseOptions, clock: $currentBranch, target: updateRefs });

$originalRefs.on(updateRefs.done, (_, { result }) => result);
$originalRefs.on(updateRefs.fail, () => new Map());
