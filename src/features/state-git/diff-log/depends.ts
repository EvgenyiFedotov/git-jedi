import { sample, combine, guard, merge } from "effector";

import { $runCommandOptions } from "../config";
import { $currentBranch } from "../current-branch";
import { diffLog } from "./effects";
import { updateDiffLog } from "./events";
import { pullEnd } from "../pull";
import { pushEnd } from "../push";
import { logUpdated } from "../log";

const $diffCommitsParams = combine(
  [$runCommandOptions, $currentBranch],
  ([options, currentBranch]) => ({
    options,
    currentBranch: currentBranch || "",
  }),
);

const updatingDiffLog = sample({
  source: $diffCommitsParams,
  clock: merge([updateDiffLog, pullEnd, pushEnd, logUpdated]),
});

logUpdated.watch(() => console.log("logUpdated"));

guard({
  source: updatingDiffLog,
  filter: ({ currentBranch }) => !!currentBranch,
  target: diffLog,
});

guard({
  source: $diffCommitsParams,
  filter: ({ currentBranch }) => !!currentBranch,
  target: diffLog,
});
