import { createEffect } from "effector";
import { reset as resetGit, ResetOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

export const reset = createEffect<ResetOptions, void>({
  handler: async (options) => {
    await pipeToPromise(resetGit(options));
  },
});
