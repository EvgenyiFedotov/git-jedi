import { createEffect, createEvent, sample } from "effector";
import { commit, CommitOptions } from "lib/api-git";

import { $baseOptions } from "../config";

export const createCommit = createEvent<string>();

export const committing = createEffect<CommitOptions, string>({
  handler: (options) => commit(options),
});

sample({
  source: $baseOptions,
  clock: createCommit,
  fn: (baseOptions, message) => ({
    ...baseOptions,
    message,
  }),
  target: committing,
});
