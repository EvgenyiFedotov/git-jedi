import * as ef from "effector";
import * as electron from "electron";

import * as model from "./";

model.openningDialogSelectWorkDir.use(({ path }) => {
  return electron.remote.dialog.showOpenDialog({
    properties: ["openDirectory"],
    defaultPath: path,
  });
});

// Read settings
ef.forward({
  from: model.init.mount,
  to: model.settingsFile.read,
});

// Select work dir
ef.sample({
  source: model.$workDir,
  clock: model.openDialogSelectWorkDir,
  fn: (path) => ({ path: path || "/" }),
  target: model.openningDialogSelectWorkDir,
});

model.$workDir.on(
  model.openningDialogSelectWorkDir.done,
  (prev, { result }) => result.filePaths[0] ?? prev ?? null,
);

// Change settings
const checkSettings = (nameProps: keyof model.Settings) => (
  settings: model.Settings,
  value: model.Settings[keyof model.Settings],
) => {
  if (settings[nameProps] !== value) {
    return { ...settings, [nameProps]: value };
  }

  return settings;
};

model.$settings
  .on(model.$workDir, checkSettings("workDir"))
  .on(model.$hotKeys, checkSettings("hotKeys"))
  .on(model.$defaultBranch, checkSettings("defaultBranch"))
  .on(model.$commitTypes, checkSettings("commitTypes"))
  .on(model.$commitScopeRoot, checkSettings("commitScopeRoot"))
  .on(model.$commitScopeLength, checkSettings("commitScopeLength"));

// Write settings

ef.forward({
  from: model.$settings.map((settings) => JSON.stringify(settings)),
  to: model.settingsFile.write,
});

model.$settings.watch(console.log);
