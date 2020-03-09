import { forward, guard, sample } from "effector";

import { init, selectCwd, changedCwd, changePathRepo } from "./events";
import {
  readSettings,
  writeSettings,
  selectCwd as selectCwdEffect,
} from "./effects";
import { $cwd, $settings, $hotKeys } from "./stores";

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
  clock: readSettings.done,
  fn: (store, { result }) => (result ? result.cwd || store || null : store),
  target: $cwd,
});

sample({
  source: $cwd,
  clock: selectCwd,
  fn: (cwd) => cwd || "/",
  target: selectCwdEffect,
});

const changeCwdAfterSelect = sample({
  source: $cwd,
  clock: selectCwdEffect.done,
  fn: (store, { result }) => ({
    store,
    next: result.filePaths[0] || store || null,
  }),
});

forward({
  from: changeCwdAfterSelect.map(({ next }) => next),
  to: $cwd,
});

guard({
  source: changeCwdAfterSelect,
  filter: ({ store, next }) => store !== next,
  target: changedCwd.prepend(
    ({ next }: { store: string | null; next: string | null }) => next,
  ),
});

forward({
  from: $settings,
  to: writeSettings,
});

sample({
  source: $hotKeys,
  clock: readSettings.done,
  fn: (store, { result }) => (result ? result.hotKeys || store || null : store),
  target: $hotKeys,
});

forward({
  from: changePathRepo,
  to: selectCwd,
});
