import { createEffect } from "effector";
import { pipeToPromise } from "lib/pipe-to-promise";
import { remote as remoteGit, RemoteAddOptions } from "lib/api-git";

export const remote = createEffect<RemoteAddOptions, void>({
  handler: async (options) => {
    await pipeToPromise(remoteGit.add(options));
  },
});
