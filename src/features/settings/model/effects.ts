import { createEffect } from "effector";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { PATH_SETTINGS } from "app/const";
import * as electron from "electron";

import { Settings } from "./stores";

const { dialog } = electron.remote;

export const writeSettings = createEffect<Settings, void>({
  handler: (settings) => {
    writeFileSync(PATH_SETTINGS, JSON.stringify(settings, null, 2));
  },
});

export const readSettings = createEffect<void, Settings | null>({
  handler: () => {
    if (existsSync(PATH_SETTINGS)) {
      return JSON.parse(readFileSync(PATH_SETTINGS).toString());
    }

    return null;
  },
});

export const selectCwd = createEffect<string, Electron.OpenDialogReturnValue>({
  handler: (defaultPath) =>
    dialog.showOpenDialog({
      properties: ["openDirectory"],
      defaultPath,
    }),
});
