import { forward, guard, sample } from "effector";

import { init, selectCwd, changedCwd } from "./events";
import {
  readSettings,
  writeSettings,
  selectCwd as selectCwdEffect,
} from "./effects";
import { $cwd, $settings } from "./stores";

const setupDefaultSettings = guard({
  source: readSettings.done,
  filter: ({ result }) => !result,
});

forward({
  from: init,
  to: readSettings,
});

sample({
  source: $settings,
  clock: setupDefaultSettings,
  target: writeSettings,
});

guard({
  source: readSettings.done,
  filter: ({ result }) => !!result && !result.cwd,
  target: selectCwd.prepend((_: any) => {}),
});

sample({
  source: $cwd,
  clock: selectCwd,
  fn: (cwd) => cwd || "/",
  target: selectCwdEffect,
});

forward({
  from: $settings,
  to: writeSettings,
});

forward({
  from: $cwd,
  to: changedCwd,
});
