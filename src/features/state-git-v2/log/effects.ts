import { createEffect } from "effector";

import { CommitOptions, commit as commitGit } from "lib/api-git-v2";

export const commit = createEffect<CommitOptions, void>({
  handler: (options) =>
    new Promise((resolve, reject) => {
      commitGit(options).end((code) => {
        console.log("COMMIT!", code);
        if (code === 0) {
          resolve();
        } else {
          reject(code);
        }
      });
    }),
});
