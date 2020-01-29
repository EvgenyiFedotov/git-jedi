import { createEvent, createEffect, sample } from "effector";
import { checkout, CheckoutOptions } from "lib/api-git";

import { $baseOptions } from "../config";

export const createBranch = createEvent<string>();

export const creatingBranch = createEffect<CheckoutOptions, string>({
  handler: (options) => checkout({ createBranch: true, ...options }),
});

sample({
  source: $baseOptions,
  clock: createBranch,
  fn: (options, target) => ({
    ...options,
    target,
  }),
  target: creatingBranch,
});
