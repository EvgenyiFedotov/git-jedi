import { createStore, combine } from "effector";
import { createPendingStore } from "lib/added-effector/create-pending-store";
import { RunCommandOptions } from "lib/run-command";

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

export const $pathRepo = $cwd.map((cwd) => {
  const cwdArr = (cwd || "").split("/");

  return `${cwdArr[cwdArr.length - 2]}/${cwdArr[cwdArr.length - 1]}`;
});

export const $commandOptions = combine(
  [$cwd],
  ([cwd]): RunCommandOptions => ({
    spawnOptions: { cwd: cwd || "/" },
    commandOptions: {
      onBefore: ({ command, args = [] }) =>
        console.log([command, ...args].join(" ")),
      onClose: (code, { log }) => {
        if (code) {
          const strlog = log.map(({ data }) => data).join("\n");

          console.info(strlog);
        }
      },
    },
  }),
);
