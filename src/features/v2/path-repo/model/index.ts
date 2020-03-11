import { createEffect, createEvent, createStore } from "effector";
import * as electron from "electron";

export const showSelectCwdDialog = createEffect<
  string,
  Electron.OpenDialogReturnValue
>({
  handler: (defaultPath) =>
    electron.remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
      defaultPath,
    }),
});

export const selectPathRepo = createEvent<void>();

export const $pathRepo = createStore<string>("");
