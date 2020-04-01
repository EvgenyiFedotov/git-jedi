import * as ef from "effector";
import * as fsPromise from "lib/fs-promise";
import { createStatusEffect } from "lib/added-effector/status-effect";
import * as electron from "electron";

import * as consts from "./constants";

const DEF_HOT_KEYS: Settings["hotKeys"] = [
  { type: "command", targetId: "changePathRepo", command: "command+shift+o" },
  { type: "command", targetId: "changeBranch", command: "command+shift+b" },
];

const DEF_COMMIT_TYPES = ["feat", "fix", "build", "chore", "refacor"];

export type HotKey = {
  type: "command";
  targetId: string;
  command: string;
};

export type Settings = {
  cwd: string | null;
  hotKeys: HotKey[];
  commitTypes: string[];
  commitScopeRoot: string;
  commitScopeLength: number;
};

export const readSettings = ef
  .createEffect<void, Settings | null>()
  .use(async () => {
    if (await fsPromise.existFile(consts.PATH_SETTINGS)) {
      const settings = await fsPromise.readFile(consts.PATH_SETTINGS);

      try {
        return JSON.parse(settings.toString());
      } catch (error) {
        return null;
      }
    }

    return null;
  });

export const writeSettings = ef
  .createEffect<Settings, void>()
  .use(async (settings) => {
    await fsPromise.writeFile(
      consts.PATH_SETTINGS,
      JSON.stringify(settings, null, 2),
    );
  });

export const showSelectCwdDialog = ef
  .createEffect<string, Electron.OpenDialogReturnValue>()
  .use((defaultPath) =>
    electron.remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
      defaultPath,
    }),
  );

export const initSettings = ef.createEvent<void>();
export const changedCwd = ef.createEvent<string | null>();
export const changeNewCommitType = ef.createEvent<string>();
export const addNewCommitType = ef.createEvent<void>();
export const removeCommitType = ef.createEvent<string>();
export const changeCommitScopeRoot = ef.createEvent<string>();
export const changeCommitScopeLength = ef.createEvent<number>();
export const selectCwd = ef.createEvent<void>();

export const $cwd = ef.createStore<Settings["cwd"]>(null);
export const $hotKeys = ef.createStore<Settings["hotKeys"]>(DEF_HOT_KEYS);
export const $commitTypes = ef.createStore<string[]>(DEF_COMMIT_TYPES);
export const $newCommitType = ef.restore(changeNewCommitType, "");
export const $commitScopeRoot = ef.restore(changeCommitScopeRoot, "");
export const $commitScopeLength = ef.restore(changeCommitScopeLength, 2);
export const $settings = ef.combine({
  cwd: $cwd,
  hotKeys: $hotKeys,
  commitTypes: $commitTypes,
  commitScopeRoot: $commitScopeRoot,
  commitScopeLength: $commitScopeLength,
});
export const { $value: $statusReadSettings } = createStatusEffect(readSettings);
