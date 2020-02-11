import { createEffect } from "effector";
import { add as addGit, AddOptions } from "lib/api-git-v2";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

export const add = createEffect<AddOptions, void>({
  handler: async (options) => {
    await pipeCommandToPromise(addGit(options));
  },
});
