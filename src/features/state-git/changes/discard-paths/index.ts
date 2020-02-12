import { createStore, createEvent, sample, combine, forward } from "effector";
import { StashOptions } from "lib/api-git";

import { $runCommandOptions } from "../../config";
import { discard } from "./effects";
import { $status } from "../status";

export const $discardPaths = createStore<{ ref: Set<string> }>({
  ref: new Set(),
});

export const addDiscardPath = createEvent<string>();
export const discardAll = createEvent<void>();
export const discardAllParams = createEvent<StashOptions>();

sample({
  source: $runCommandOptions,
  clock: addDiscardPath,
  fn: (options, path) => ({ ...options, paths: [path] }),
  target: discard,
});

sample({
  source: combine({ options: $runCommandOptions, status: $status }),
  clock: discardAll,
  fn: ({ options, status }) => ({
    ...options,
    paths: Array.from(status.values()).map((changeLine) => changeLine.path),
  }),
  target: discardAllParams,
});

forward({ from: discardAllParams, to: discard });

$discardPaths.on(addDiscardPath, ({ ref }, path) => {
  ref.add(path);

  return { ref };
});
$discardPaths.on(discardAllParams, ({ ref }, { paths }) => {
  if (paths) {
    paths.forEach((path) => ref.add(path));
  }

  return { ref };
});
$discardPaths.on(discard.done, ({ ref }, { params }) => {
  const { paths } = params;

  if (paths && paths[0]) {
    ref.delete(paths[0]);
  }

  return { ref };
});
