import {
  combine,
  createEvent,
  createEffect,
  createStore,
  sample,
  guard,
} from "effector";
import { reset, ResetOptions } from "lib/api-git";

import { $status } from "./status";
import { $baseOptions } from "../config";

const baseOptions = $baseOptions.getState();

export const $unstagedChanges = combine($status, (status) =>
  status.filter((status) => !!status.status),
);
const $unstageParams = createStore<ResetOptions>({
  ...baseOptions,
  paths: [],
});

export const unstage = createEvent<string>();
export const unstageAll = createEvent();

export const unstaging = createEffect<ResetOptions, string>({
  handler: (options) => reset(options),
});
export const unstagingAll = createEffect<ResetOptions, string>({
  handler: (options) => reset(options),
});

guard({
  source: $unstageParams,
  filter: ({ paths }) => !!(paths && paths.length),
  target: unstaging,
});

sample({ source: $baseOptions, clock: unstageAll, target: unstagingAll });

$unstageParams.on($baseOptions, (store, baseOptions) => ({
  ...store,
  ...baseOptions,
}));
$unstageParams.on(unstage, (store, path) => ({
  ...store,
  paths: [path],
}));
$unstageParams.on(unstaging.finally, (store) => ({ ...store, paths: [] }));
