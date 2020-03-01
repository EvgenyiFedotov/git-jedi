import { combine, createEvent, sample } from "effector";

import { $status } from "../status";
import { $runCommandOptions } from "../../config";
import { reset } from "./effects";

export const $unstagedChanges = combine($status, (status) =>
  status.filter((status) => !!status.status),
);

export const unstage = createEvent<string>();
export const unstageAll = createEvent();

sample({
  source: $runCommandOptions,
  clock: unstage,
  fn: (options, path) => ({ ...options, paths: [path] }),
  target: reset,
});

sample({
  source: $runCommandOptions,
  clock: unstageAll,
  target: reset,
});
