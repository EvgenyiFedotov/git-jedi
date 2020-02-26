import { createEffect, sample, guard, forward } from "effector";
import {
  rebase as rebaseGit,
  ResetOptions,
  config as configGit,
  ConfigOptions,
} from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";
import { parseArgs } from "lib/parse-args";

import { $runCommandOptions } from "../config";
import { rebaseUp, abortRebase, rebaseEnd } from "./events";
import { fileConnector } from "../editor";

const CORE_EDITOR = "CORE_EDITOR";

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

const changeCoreEditor = createEffect<ConfigOptions, void>({
  handler: async (options) => {
    const pipe = configGit({ ...options, list: true }).next((config) => {
      const pathEditor = getPathToEditor();
      const coreEditor = config["core.editor"];

      if (coreEditor && coreEditor !== pathEditor) {
        localStorage.setItem(CORE_EDITOR, coreEditor);

        configGit({
          ...options,
          value: ["core.editor", pathEditor],
        });
      }
    });

    await pipeToPromise(pipe);
  },
});

const backCoreEditor = createEffect<ConfigOptions, void>({
  handler: async (options) => {
    const pathEditor = getPathToEditor();
    const coreEditor = localStorage.getItem(CORE_EDITOR);

    if (coreEditor && coreEditor !== pathEditor) {
      const pipe = configGit({
        ...options,
        value: ["core.editor", coreEditor],
      });

      await pipeToPromise(pipe);
    }

    localStorage.removeItem(CORE_EDITOR);
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

function getPathToEditor(): string {
  const appPath = parseArgs(process.argv.slice(2))["--app-path"];
  let path;

  switch (process.platform) {
    case "darwin":
      path = "git-editor-macos";
      break;
    case "linux":
      path = "git-editor-linux";
      break;
    case "win32":
      path = "git-editor-win.exe";
      break;
  }

  return `${appPath}/${path}`;
}
