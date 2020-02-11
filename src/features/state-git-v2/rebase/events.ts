import { createEvent, sample } from "effector";

import { $runCommandOptions } from "../config";
import { rebase } from "./effects";

export const rebaseUp = createEvent<string>();
export const abortRebase = createEvent<void>();

sample({
  source: $runCommandOptions,
  clock: rebaseUp,
  fn: (options, target) => ({ ...options, target, interactive: true }),
  target: rebase,
});

sample({
  source: $runCommandOptions,
  clock: abortRebase,
  fn: (options) => ({ ...options, abort: true }),
  target: rebase,
});
