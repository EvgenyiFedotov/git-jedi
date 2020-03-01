import { combine, createEvent, sample } from "effector";

import { $status } from "../status";
import { $runCommandOptions } from "../../config";
import { add } from "./effects";

export const $stagedChanges = combine($status, (status) =>
  status.filter((status) => {
    return !!status.stagedStatus && status.stagedStatus !== "untracked";
  }),
);

export const stage = createEvent<string[]>();
export const stageAll = createEvent<void>();

sample({
  source: $runCommandOptions,
  clock: stage,
  fn: (options, paths) => ({
    ...options,
    paths,
  }),
  target: add,
});

sample({
  source: $runCommandOptions,
  clock: stageAll,
  target: add,
});
