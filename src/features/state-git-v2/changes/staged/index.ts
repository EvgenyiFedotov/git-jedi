import { combine, createEvent, createEffect, sample } from "effector";
import { add as addGit, AddOptions } from "lib/api-git-v2";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

import { $status } from "../status";
import { $runCommandOptions } from "../../config";

export const $stagedChanges = combine($status, (status) =>
  status.filter((status) => {
    return !!status.stagedStatus && status.stagedStatus !== "untracked";
  }),
);

export const stage = createEvent<string>();
export const stageAll = createEvent<void>();

export const add = createEffect<AddOptions, void>({
  handler: async (options) => {
    await pipeCommandToPromise(addGit(options));
  },
});

sample({
  source: $runCommandOptions,
  clock: stage,
  fn: (options, path) => ({
    ...options,
    paths: [path],
  }),
  target: add,
});

sample({
  source: $runCommandOptions,
  clock: stageAll,
  target: add,
});
