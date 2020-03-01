import { createEffect } from "effector";
import { fetch as fetchGit, FetchOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

export const fetch = createEffect<FetchOptions, void>({
  handler: async (options) => {
    await pipeToPromise(fetchGit(options));
  },
});
