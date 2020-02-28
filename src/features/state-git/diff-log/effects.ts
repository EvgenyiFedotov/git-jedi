import { log as logGit, LogOptions, Commit, fetch } from "lib/api-git";
import { createEffect } from "effector";
import { pipeToPromise, concatMap } from "lib/pipe-to-promise";

export const diffLog = createEffect<
  { options: LogOptions; currentBranch: string },
  { pull: Map<string, Commit>; push: Map<string, Commit> }
>({
  handler: async ({ options, currentBranch }) => {
    // TODO run sametimes
    // await pipeToPromise(
    //   fetch({
    //     commandOptions: options.commandOptions,
    //     spawnOptions: options.spawnOptions,
    //   }),
    // );

    const pull = concatMap(
      await pipeToPromise(
        logGit({
          ...options,
          range: `${currentBranch}..origin/${currentBranch}`,
        }),
      ),
    );

    const push = concatMap(
      await pipeToPromise(
        logGit({
          ...options,
          range: `origin/${currentBranch}..${currentBranch}`,
        }),
      ),
    );

    return { pull, push };
  },
});
