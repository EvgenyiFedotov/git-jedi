import { createEffect, sample, guard } from "effector";
import { rebase as rebaseGit, ResetOptions } from "lib/api-git";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

import { $runCommandOptions } from "../config";
import { rebaseUp, abortRebase, rebaseEnd } from "./events";

export const rebase = createEffect<ResetOptions, void>({
  handler: async (options) => {
    await pipeCommandToPromise(rebaseGit(options));
  },
});

sample({
  source: $runCommandOptions,
  clock: rebaseUp,
  fn: (options, target) => ({
    ...options,
    target,
    interactive: true,
    commandOptions: { ...options.commandOptions, key: "rebase-up" },
  }),
  target: rebase,
});

guard({
  source: rebase.done,
  filter: ({ params }) =>
    !!params.commandOptions && params.commandOptions.key === "rebase-up",
  target: rebaseEnd.prepend((v: any) => {}),
});

sample({
  source: $runCommandOptions,
  clock: abortRebase,
  fn: (options) => ({
    ...options,
    abort: true,
    commandOptions: { ...options.commandOptions, key: "rebase-abort" },
  }),
  target: rebase,
});
