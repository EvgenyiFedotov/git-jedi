import * as ef from "effector";

import * as common from "./common";

type Settings = {
  workDir: string;
  defaultBranch: string;
  commitTypes: string[];
  commitScopeRoot: string;
  commitScopeLength: number;
};

// Effects
const readSettings = ef.createEffect<void, Settings>({
  handler: common.readSetings,
});
const writeSettings = ef.createEffect<Settings, void>({
  handler: common.writeSettings,
});
const showSelectPathDialog = ef
  .createEffect<string, Electron.OpenDialogReturnValue>()
  .use(common.showOpenDialog);

// Events
export const runReadSettings = ef.createEvent();
export const runWriteSettings = ef.createEvent();
export const runShowSelectPathDialog = ef.createEvent();

// Stores
export const $workDir = ef.createStore<string>("");
const $defaultBranch = ef.createStore<string>("");
const $commitTypes = ef.createStore<string[]>([]);
const $commitScopeRoot = ef.createStore<string>("");
const $commitScopeLength = ef.createStore<number>(0);

// Init
const settingsRead = readSettings.done.map(({ result }) => result);
const workDirSelected = showSelectPathDialog.done.map(
  ({ result }) => result.filePaths[0],
);

const $settings = ef.combine({
  workDir: $workDir,
  defaultBranch: $defaultBranch,
  commitTypes: $commitTypes,
  commitScopeRoot: $commitScopeRoot,
  commitScopeLength: $commitScopeLength,
});

ef.forward({
  from: runReadSettings,
  to: readSettings,
});

ef.sample({
  source: $settings,
  clock: runWriteSettings,
  target: writeSettings,
});

ef.sample({
  source: $workDir,
  clock: runShowSelectPathDialog,
  target: showSelectPathDialog,
});

// Init [stores]
$workDir
  .on(settingsRead, (_, settings) => settings.workDir)
  .on(workDirSelected, (prev, value) => value || prev);

$defaultBranch.on(settingsRead, (_, settings) => settings.defaultBranch);

$commitTypes.on(settingsRead, (_, settings) => settings.commitTypes);

$commitScopeRoot.on(settingsRead, (_, settings) => settings.commitScopeRoot);

$commitScopeLength.on(
  settingsRead,
  (_, settings) => settings.commitScopeLength,
);

// Dev
$settings.watch(console.log);
