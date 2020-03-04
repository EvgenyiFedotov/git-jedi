import { combine } from "effector";
import { RunCommandOptions } from "lib/run-command";
import { $settings } from "features/settings";

export const $commandOptions = combine(
  [$settings],
  ([{ cwd }]): RunCommandOptions => ({
    spawnOptions: { cwd: cwd || "/" },
    commandOptions: {
      onBefore: ({ command, args = [] }) =>
        console.log([command, ...args].join(" ")),
    },
  }),
);
