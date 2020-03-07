import { createStore, combine } from "effector";
import { createPendingStore } from "lib/added-effector/create-pending-store";

import { readSettings } from "./effects";
import { HotKey } from "./events";

export interface Settings {
  cwd: string | null;
  hotKeys: HotKey[];
}

export const $cwd = createStore<Settings["cwd"]>(null);

export const $hotKeys = createStore<Settings["hotKeys"]>([
  { type: "command", targetId: "changePathRepo", command: "command+shift+o" },
]);

export const $settings = combine({ cwd: $cwd, hotKeys: $hotKeys });

export const $readSettings = createPendingStore(readSettings);
