import { createStore } from "effector";

import { readSettings, selectCwd } from "./effects";

export interface Settings {
  cwd: string | null;
}

export const $settings = createStore<Settings>({ cwd: null });

$settings.on(readSettings.done, (store, { result }) =>
  result ? result : store,
);
$settings.on(selectCwd.done, (store, { result }) => {
  const cwd = result.filePaths[0] || null;

  if (!cwd) {
    return store;
  }

  return {
    ...store,
    cwd: cwd || store.cwd,
  };
});

$settings.watch(console.log);
