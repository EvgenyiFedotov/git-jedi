import { log as logGit, LogOptions, Commit, fetch } from "lib/api-git";
import { createEffect } from "effector";
import { pipeToPromise, reduceConcatMap } from "lib/pipe-to-promise";

export const diffLog = createEffect<
  { options: LogOptions; currentBranch: string },
  { pull: Map<string, Commit>; push: Map<string, Commit> }
>({
  handler: async ({ options, currentBranch }) => {
    await pipeToPromise(
      fetch({
        commandOptions: options.commandOptions,
        spawnOptions: options.spawnOptions,
      }),
    );

    const pull = reduceConcatMap(
      await pipeToPromise(
        logGit({
          ...options,
          range: `${currentBranch}..origin/${currentBranch}`,
        }),
      ),
    );

    const push = reduceConcatMap(
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
