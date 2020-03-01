import { combine } from "effector";
import { RunCommandOptions } from "lib/run-command";

import { $cwd } from "../cwd";
import { onClose } from "./notification";

export const $runCommandOptions = combine(
  {
    cwd: $cwd,
  },
  ({ cwd }): RunCommandOptions => ({
    spawnOptions: { cwd },
    commandOptions: {
      onBefore: ({ command, args = [] }) =>
        console.log([command, ...args].join(" ")),
      onClose,
    },
  }),
);
