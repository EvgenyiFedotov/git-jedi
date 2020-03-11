import { guard, forward, sample } from "effector";
import { showSelectCwdDialog } from "features/v2/path-repo/model";

import {
  readSettings,
  init,
  $settings,
  writeSettings,
  $cwd,
  changedCwd,
  $hotKeys,
} from ".";

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

sample({
  source: $cwd,
  clock: readSettings.done,
  fn: (store, { result }) => (result ? result.cwd || store || null : store),
  target: $cwd,
});

const changeCwdAfterSelect = sample({
  source: $cwd,
  clock: showSelectCwdDialog.done,
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
