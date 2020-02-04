import { createStore, createEffect, merge, sample } from "effector";
import { defaultRun } from "lib/default-run";
import { showRef, showRefSync, Refs, ShowRefOptions } from "lib/api-git";

import { $baseOptions } from "../config";
import { createInitCommit } from "./notifications";
import { $currentBranch } from "../current-branch";
import { writingContentCommitMesssage } from "../log/rebase/effects";

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

sample({
  source: $baseOptions,
  clock: merge([
    $currentBranch,
    $baseOptions,
    writingContentCommitMesssage.done,
  ]),
  target: updateRefs,
});

// TODO After create commit

$originalRefs.on(updateRefs.done, (_, { result }) => result);
$originalRefs.on(updateRefs.fail, () => new Map());
