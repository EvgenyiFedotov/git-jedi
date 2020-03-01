import { createEffect } from "effector";
import { stash as stashGit, StashOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

export const discard = createEffect<StashOptions, void>({
  handler: async ({ paths, ...options }) => {
    await pipeToPromise(stashGit({ paths, ...options }));
    await pipeToPromise(stashGit({ action: "drop", ...options }));
  },
});
