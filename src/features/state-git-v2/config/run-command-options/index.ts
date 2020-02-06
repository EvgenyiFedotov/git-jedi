import { combine } from "effector";
import { RunCommandOptions } from "lib/api-git-v2";

import { $cwd } from "../cwd";
import { onError } from "./notification-error";

export const $runCommandOptions = combine(
  {
    cwd: $cwd,
  },
  ({ cwd }): RunCommandOptions => ({
    spawnOptions: { cwd },
    commandOptions: {
      onBefore: (command) => console.log(command),
      onError,
    },
  }),
);
