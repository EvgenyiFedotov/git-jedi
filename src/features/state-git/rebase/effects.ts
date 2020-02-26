import { createEffect, sample, guard, forward } from "effector";
import { rebase as rebaseGit, ResetOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

import { $runCommandOptions } from "../config";
import { rebaseUp, abortRebase, rebaseEnd } from "./events";
import { fileConnector, changeCoreEditor, backCoreEditor } from "../editor";

export const rebase = createEffect<ResetOptions, void>({
  handler: async (options) => {
    await changeCoreEditor({
      commandOptions: options.commandOptions,
      spawnOptions: options.spawnOptions,
    });

    await pipeToPromise(rebaseGit(options));

    await backCoreEditor({
      commandOptions: options.commandOptions,
      spawnOptions: options.spawnOptions,
    });
  },
});

const aborting = createEffect<void, void>({
  handler: async () => {
    fileConnector.send("abort");
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

forward({
  from: abortRebase,
  to: aborting,
});
