import { combine, createEvent, createStore, sample, guard } from "effector";
import { ResetOptions } from "lib/api-git";

import { $status } from "../status";
import { $baseOptions } from "../../config";
import { unstaging, unstagingAll } from "./effects";

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
