import { createEffect, sample, guard } from "effector";
import {
  rebase as rebaseGit,
  ResetOptions,
  config as configGit,
  ConfigOptions,
} from "lib/api-git";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

import { $runCommandOptions } from "../config";
import { rebaseUp, abortRebase, rebaseEnd } from "./events";

import { parseArgs } from "lib/parse-args";

const CORE_EDITOR = "CORE_EDITOR";

export const rebase = createEffect<ResetOptions, void>({
  handler: async (options) => {
    await changeCoreEditor({
      commandOptions: options.commandOptions,
      spawnOptions: options.spawnOptions,
    });
    await pipeCommandToPromise(rebaseGit(options));
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

    await pipeCommandToPromise(pipe);
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

      await pipeCommandToPromise(pipe);
    }

    localStorage.removeItem(CORE_EDITOR);
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
