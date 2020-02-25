import { createEffect } from "effector";
import { add as addGit, AddOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

export const add = createEffect<AddOptions, void>({
  handler: async (options) => {
    await pipeToPromise(addGit(options));
  },
});
