import { createEffect } from "effector";
import { reset as resetGit, ResetOptions } from "lib/api-git-v2";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

export const reset = createEffect<ResetOptions, void>({
  handler: async (options) => {
    await pipeCommandToPromise(resetGit(options));
  },
});
