import { forward, guard, sample, merge } from "effector";

import { init, selectCwd } from "./events";
import {
  readSettings,
  writeSettings,
  selectCwd as selectCwdEffect,
} from "./effects";
import { $settings } from "./stores";

const setupDefaultSettings = guard({
  source: readSettings.done,
  filter: ({ result }) => !result,
});

const setupCwd = guard({
  source: $settings,
  filter: ({ cwd }) => !cwd,
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

sample({
  source: $settings,
  clock: merge([selectCwd, setupCwd]),
  fn: ({ cwd }) => cwd || "/",
  target: selectCwdEffect,
});

forward({
  from: $settings,
  to: writeSettings,
});

setupDefaultSettings.watch(() => console.log("setupDefaultSettings"));
