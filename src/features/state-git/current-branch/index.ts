import {
  createStore,
  createEffect,
  sample,
  createEvent,
  merge,
} from "effector";
import {
  RevParseOptions,
  revParse as revParseGit,
  checkout as checkoutGit,
  CheckoutOptions,
} from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

import { $runCommandOptions } from "../config";

export const $currentBranch = createStore<string | null>(null);

export const checkoutTo = createEvent<string>();
export const createBranch = createEvent<string>();

export const revParse = createEffect<RevParseOptions, string | null>({
  handler: async (options) => {
    const log = await pipeToPromise(revParseGit(options));
    return log[0] || null;
  },
});
export const checkout = createEffect<CheckoutOptions, void>({
  handler: async (options) => {
    await pipeToPromise(checkoutGit(options));
  },
});

sample({
  source: $runCommandOptions,
  clock: merge([$runCommandOptions, checkout.done]),
  target: revParse,
});

sample({
  source: $runCommandOptions,
  clock: checkoutTo,
  fn: (options, target) => ({
    ...options,
    target,
  }),
  target: checkout,
});

sample({
  source: $runCommandOptions,
  clock: createBranch,
  fn: (options, target) => ({
    ...options,
    target,
    createBranch: true,
  }),
  target: checkout,
});

$currentBranch.on(revParse.done, (_, { result }) => result);
