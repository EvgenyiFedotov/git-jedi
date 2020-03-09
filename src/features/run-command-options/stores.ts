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
      onClose: (code, { log }) => {
        if (code) {
          const strlog = log.map(({ data }) => data).join("\n");

          console.info(strlog);
        }
      },
    },
  }),
);
