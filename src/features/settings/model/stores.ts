import { createStore, combine } from "effector";

import { readSettings, selectCwd } from "./effects";

export interface Settings {
  cwd: string | null;
}

export const $cwd = createStore<string | null>(null);

$cwd.on(readSettings.done, (store, { result }) =>
  result ? result.cwd || store || null : store,
);

$cwd.on(
  selectCwd.done,
  (store, { result }) => result.filePaths[0] || store || null,
);

export const $settings = combine({ cwd: $cwd });
