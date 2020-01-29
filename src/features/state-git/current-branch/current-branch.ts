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
import { checkoutingTo } from "./checkout-to";
import { creatingBranch } from "./create-branch";

const baseOptions = $baseOptions.getState();
const defValue = defaultRun(
  () => revParseSync({ ...baseOptions, onReject: () => {} }),
  "master",
);

export const $currentBranch = createStore<string>(defValue);

export const changeCurrentBranch = createEvent<string>();

export const updatingCurrentBranch = createEffect<RefParseOptions, string>({
  handler: (options) => revParse(options),
});

forward({ from: $baseOptions, to: updatingCurrentBranch });

sample({
  source: $baseOptions,
  clock: checkoutingTo.finally,
  target: updatingCurrentBranch,
});

sample({
  source: $baseOptions,
  clock: creatingBranch.finally,
  target: updatingCurrentBranch,
});

$currentBranch.on(updatingCurrentBranch.done, (_, { result }) => result);
