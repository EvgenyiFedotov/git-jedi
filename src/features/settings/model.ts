import * as ef from "effector";
import { createMount } from "lib/effector-extensions/core/mount";
import { createFile } from "lib/effector-extensions/core/file";
import { PATH_SETTINGS } from "app/const";
import { createStatusEffect } from "lib/effector-extensions/core/status-effect";

type HotKey = {
  type: "command";
  targetId: string;
  command: string;
};

export type Settings = {
  workDir: string | null;
  hotKeys: HotKey[];
  defaultBranch: string;
  commitTypes: string[];
  commitScopeRoot: string;
  commitScopeLength: number;
};

export const openningDialogSelectWorkDir = ef.createEffect<
  { path: string },
  Electron.OpenDialogReturnValue
>();

export const init = createMount();
export const openDialogSelectWorkDir = ef.createEvent<void>();

export const settingsFile = createFile(PATH_SETTINGS);

export const $settings = settingsFile.$file.map<Settings>((file) =>
  file ? JSON.parse(file) : {},
);
export const $statusReading = createStatusEffect(settingsFile.read);
export const $workDir = $settings.map(({ workDir }) => workDir ?? null);
export const $hotKeys = $settings.map(({ hotKeys }) => hotKeys ?? []);
export const $defaultBranch = $settings.map(
  ({ defaultBranch }) => defaultBranch ?? "master",
);
export const $commitTypes = $settings.map(
  ({ commitTypes }) => commitTypes ?? [],
);
export const $commitScopeRoot = $settings.map(
  ({ commitScopeRoot }) => commitScopeRoot ?? "",
);
export const $commitScopeLength = $settings.map(
  ({ commitScopeLength }) => commitScopeLength ?? 2,
);
