import { PATH_SETTINGS } from "app/constants";
import { writeFile, readFile } from "lib/fs-promise";
import * as electron from "electron";

export async function writeSettings(value: object) {
  await writeFile(PATH_SETTINGS, JSON.stringify(value, null, 2));
}

export async function readSetings() {
  const settings = await readFile(PATH_SETTINGS);

  return JSON.parse(settings.toString());
}

export function showOpenDialog(defaultPath: string) {
  return electron.remote.dialog.showOpenDialog({
    properties: ["openDirectory"],
    defaultPath,
  });
}
