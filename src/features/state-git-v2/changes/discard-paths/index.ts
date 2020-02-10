import { createStore, createEvent, createEffect, sample } from "effector";
import { stash as stashGit, StashOptions } from "lib/api-git-v2";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

import { $runCommandOptions } from "../../config";

export const $discardPaths = createStore<{ ref: Set<string> }>({
  ref: new Set(),
});

export const addDiscardPath = createEvent<string>();

export const discard = createEffect<StashOptions, void>({
  handler: async ({ paths, ...options }) => {
    await pipeCommandToPromise(stashGit({ paths, ...options }));
    await pipeCommandToPromise(stashGit({ action: "drop", ...options }));
  },
});

sample({
  source: $runCommandOptions,
  clock: addDiscardPath,
  fn: (options, path) => ({ ...options, paths: [path] }),
  target: discard,
});

$discardPaths.on(addDiscardPath, ({ ref }, path) => {
  ref.add(path);
  return { ref };
});
$discardPaths.on(discard.done, ({ ref }, { params }) => {
  const { paths } = params;

  if (paths && paths[0]) {
    ref.delete(paths[0]);
  }

  return { ref };
});
