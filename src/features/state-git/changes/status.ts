import { createStore, createEffect, sample, merge } from "effector";
import { status, statusSync, StatusPath, StatusOptions } from "lib/api-git";
import { defaultRun } from "lib/default-run";

import { $baseOptions } from "../config";
import { discarding } from "./discarding";
import { staging, stagingAll } from "./staged/effects";
import { unstaging, unstagingAll } from "./unstaged/effects";
import { $currentBranch } from "../current-branch";
import { committing } from "../log";

const baseOptions = $baseOptions.getState();
const defStatus = defaultRun(() => statusSync(baseOptions), []);

export const $status = createStore<StatusPath[]>(defStatus);

export const updateStatus = createEffect<StatusOptions, StatusPath[]>({
  handler: (options) => status(options),
});

sample({
  source: $baseOptions,
  clock: merge([
    $baseOptions,
    discarding.finally,
    staging.finally,
    stagingAll.finally,
    unstaging.finally,
    unstagingAll.finally,
    $currentBranch,
    committing.done,
  ]),
  target: updateStatus,
});

$status.on(updateStatus.done, (_, { result }) => result);
