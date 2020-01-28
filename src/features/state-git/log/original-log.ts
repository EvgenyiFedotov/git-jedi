import { createStore, createEffect, sample, combine } from "effector";
import { log, logSync, Log, LogOptions } from "lib/api-git";
import { defaultRun } from "lib/default-run";

import { $baseOptions } from "../config";
import { $currentBranch } from "../current-branch";

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
  source: $updateLogParams,
  clock: $updateLogParams,
  target: updateLog,
});

sample({
  source: $updateLogParams,
  clock: $currentBranch,
  target: updateLog,
});

// TODO Add update after commit

$originalLog.on(updateLog.done, (_, { result }) => result);
$originalLog.on(updateLog.fail, () => new Map());
