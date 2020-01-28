import {
  createStore,
  createEvent,
  createEffect,
  forward,
  sample,
} from "effector";
import { defaultRun } from "lib/default-run";
import { revParse, revParseSync, RefParseOptions } from "lib/api-git";

import { $baseOptions } from "../config";
import { checkout } from "./checkout-to-branch";

const baseOptions = $baseOptions.getState();
const defValue = defaultRun(
  () => revParseSync({ ...baseOptions, onReject: () => {} }),
  "master",
);

export const $currentBranch = createStore<string>(defValue);

export const changeCurrentBranch = createEvent<string>();

export const updateCurrentBranch = createEffect<RefParseOptions, string>({
  handler: (options) => revParse(options),
});

forward({ from: $baseOptions, to: updateCurrentBranch });

sample({
  source: $baseOptions,
  clock: checkout.done,
  target: updateCurrentBranch,
});

$currentBranch.on(updateCurrentBranch.done, (_, { result }) => result);
