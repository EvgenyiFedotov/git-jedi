import { createEffect } from "effector";
import { pull as pullGit, PullOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

export const pull = createEffect<PullOptions, void>({
  handler: async (options) => {
    await pipeToPromise(pullGit(options));
  },
});
