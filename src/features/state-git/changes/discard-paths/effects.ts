import { createEffect } from "effector";
import { stash as stashGit, StashOptions } from "lib/api-git-v2";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

export const discard = createEffect<StashOptions, void>({
  handler: async ({ paths, ...options }) => {
    await pipeCommandToPromise(stashGit({ paths, ...options }));
    await pipeCommandToPromise(stashGit({ action: "drop", ...options }));
  },
});
