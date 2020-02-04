import { createStore, createEffect, sample, combine, merge } from "effector";
import { log, logSync, Log, LogOptions } from "lib/api-git";
import { defaultRun } from "lib/default-run";

import { $baseOptions } from "../config";
import { $currentBranch } from "../current-branch";
import { committing } from "./create-commit";
import { writingContentCommitMesssage } from "./rebase/effects";

const baseOptions = $baseOptions.getState();
const defLog = defaultRun(
  () => logSync({ ...baseOptions, onReject: () => {} }),
  new Map(),
);

export const $originalLog = createStore<Log>(defLog);
export const $updateLogParams = combine(
  { baseOptions: $baseOptions },
  ({ baseOptions }) => ({ ...baseOptions }),
);

export const updateLog = createEffect<LogOptions, Log>({
  handler: (options) => log(options),
});

sample({
  source: $baseOptions,
  clock: merge([
    $updateLogParams,
    $currentBranch,
    committing.done,
    writingContentCommitMesssage.done,
  ]),
  target: updateLog,
});

$originalLog.on(updateLog.done, (_, { result }) => result);
$originalLog.on(updateLog.fail, () => new Map());
