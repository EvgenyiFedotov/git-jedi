import { createEffect } from "effector";
import { rebase as rebaseGit, ResetOptions } from "lib/api-git-v2";

export const rebase = createEffect<ResetOptions, void>({
  handler: async (options) => {
    rebaseGit(options);
  },
});
