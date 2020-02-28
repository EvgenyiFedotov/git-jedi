import { createEffect } from "effector";
import { config as configGit, ConfigOptions, Config } from "lib/api-git";
import { pipeToPromise, concatObject } from "lib/pipe-to-promise";

export const config = createEffect<ConfigOptions, Config>({
  handler: async (options) => {
    const result = await pipeToPromise(configGit({ ...options, list: true }));

    return concatObject(result);
  },
});
