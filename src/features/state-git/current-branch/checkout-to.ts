import { createStore, createEvent, createEffect, guard } from "effector";
import { CheckoutOptions, checkout as checkoutGit } from "lib/api-git";

import { $baseOptions } from "../config";

const baseOptions = $baseOptions.getState();

export const $checkoutToParams = createStore<CheckoutOptions>({
  ...baseOptions,
  target: "",
});

export const checkoutTo = createEvent<string>();

export const checkoutingTo = createEffect<CheckoutOptions, string>({
  handler: (options) => checkoutGit(options),
});

guard({
  source: $checkoutToParams,
  filter: ({ target }) => !!target,
  target: checkoutingTo,
});

$checkoutToParams.on($baseOptions, (store, baseOptions) => ({
  ...store,
  ...baseOptions,
}));
$checkoutToParams.on(checkoutTo, (store, target) => ({
  ...store,
  target,
}));
$checkoutToParams.on(checkoutingTo.finally, (store) => ({
  ...store,
  target: "",
}));
