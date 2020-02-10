import { createStore, createEffect, sample, merge } from "effector";
import { status as statusGit, StatusOptions, ChangeLine } from "lib/api-git-v2";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

import { $runCommandOptions } from "../../config";
import { $currentBranch } from "../../current-branch";
import { commit } from "../../log";

export const $status = createStore<ChangeLine[]>([]);

export const status = createEffect<StatusOptions, ChangeLine[]>({
  handler: async (options) => {
    const result = await pipeCommandToPromise(statusGit(options));
    return result.reduce((memo, chunk) => [...memo, ...chunk], []);
  },
});

sample({
  source: $runCommandOptions,
  clock: merge([$runCommandOptions, $currentBranch, commit.done]),
  target: status,
});

$status.on(status.done, (_, { result }) => result);
