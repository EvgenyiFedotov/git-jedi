import { createEffect } from "effector";
import { push as pushGit, PushOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

export const push = createEffect<PushOptions, void>({
  handler: async (options) => {
    await pipeToPromise(pushGit(options));
  },
});
