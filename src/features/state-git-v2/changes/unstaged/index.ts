import { combine, createEvent, createEffect, sample } from "effector";
import { reset as resetGit, ResetOptions } from "lib/api-git-v2";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

import { $status } from "../status";
import { $runCommandOptions } from "../../config";

export const $unstagedChanges = combine($status, (status) =>
  status.filter((status) => !!status.status),
);

export const unstage = createEvent<string>();
export const unstageAll = createEvent();

export const reset = createEffect<ResetOptions, void>({
  handler: async (options) => {
    await pipeCommandToPromise(resetGit(options));
  },
});

sample({
  source: $runCommandOptions,
  clock: unstage,
  fn: (options, path) => ({ ...options, path: [path] }),
  target: reset,
});

sample({
  source: $runCommandOptions,
  clock: unstageAll,
  target: reset,
});
