import { combine, createEffect, createEvent, guard, sample } from "effector";
import * as electron from "electron";

import { $cwd, changeCwd } from "features/state-git";

const { dialog } = electron.remote;

export const $path = combine($cwd, (cwd) => {
  const cwdArr = cwd.split("/");

  return [cwdArr[cwdArr.length - 2], cwdArr[cwdArr.length - 1]]
    .filter(Boolean)
    .join("/");
});

export const selectingPath = createEffect<
  string,
  Electron.OpenDialogReturnValue
>({
  handler: (defaultPath) =>
    dialog.showOpenDialog({
      properties: ["openDirectory"],
      defaultPath,
    }),
});

export const openDialog = createEvent<void>();

sample({
  source: $cwd,
  clock: openDialog,
  target: selectingPath,
});

guard({
  source: selectingPath.done,
  filter: ({ result }) => result.canceled === false,
  target: changeCwd.prepend(
    ({
      result,
    }: {
      params: string;
      result: Electron.OpenDialogReturnValue;
    }) => {
      return result.filePaths[0];
    },
  ),
});
