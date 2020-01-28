import { createStore, createEvent, createEffect, guard } from "effector";
import { stash, StashOptions } from "lib/api-git";

import { $baseOptions } from "../config";

const baseOptions = $baseOptions.getState();

export const $discardPaths = createStore<Set<string>>(new Set());
const $discardingParams = createStore<StashOptions>({
  ...baseOptions,
  paths: [],
});

export const discard = createEvent<string>();

export const discarding = createEffect<StashOptions, void>({
  handler: async ({ paths, ...options }) => {
    await stash({ paths, ...options });
    await stash({ action: "drop", ...options });
  },
});

guard({
  source: $discardingParams,
  filter: ({ paths }) => !!(paths && paths.length),
  target: discarding,
});

$discardPaths.on(discard, (store, path) => {
  if (!store.has(path)) {
    return new Set([...store, path]);
  }

  return store;
});
$discardPaths.on(discarding.finally, (store, { params }) => {
  const { paths } = params;
  const [path] = paths || [];

  if (path && store.has(path)) {
    store.delete(path);

    return new Set([...store]);
  }

  return store;
});

$discardingParams.on($baseOptions, (store, baseOptions) => ({
  ...store,
  ...baseOptions,
}));
$discardingParams.on(discard, (store, path) => ({
  ...store,
  paths: [path],
}));
$discardingParams.on(discarding.finally, (store) => ({ ...store, paths: [] }));
