import { createStore, createEvent, createEffect } from "effector";
import { CheckoutOptions, checkout as checkoutGit } from "lib/api-git";

import { $baseOptions } from "../config";

const baseOptions = $baseOptions.getState();

export const $checkoutToBranchParams = createStore<CheckoutOptions>({
  ...baseOptions,
  target: "",
});

export const checkoutToBranch = createEvent<string>();

export const checkout = createEffect<CheckoutOptions, string>({
  handler: (options) => checkoutGit(options),
});

$checkoutToBranchParams.on($baseOptions, (store, baseOptions) => ({
  ...store,
  ...baseOptions,
}));
$checkoutToBranchParams.on(checkoutToBranch, (store, target) => ({
  ...store,
  target,
}));
