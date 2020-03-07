import { combine } from "effector";
import { RunCommandOptions } from "lib/run-command";
import { $cwd } from "features/settings";

export const $commandOptions = combine(
  [$cwd],
  ([cwd]): RunCommandOptions => ({
    spawnOptions: { cwd: cwd || "/" },
    commandOptions: {
      onBefore: ({ command, args = [] }) =>
        console.log([command, ...args].join(" ")),
    },
  }),
);
