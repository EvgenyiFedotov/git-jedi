import { combine } from "effector";
import { BaseOptions } from "lib/api-git";

import { $cwd } from "./cwd";
import { onReject } from "./notification-error";

export const $baseOptions = combine(
  { cwd: $cwd },
  ({ cwd }): BaseOptions => ({
    execOptions: { cwd },
    onExec: (command) => console.log(command),
    onReject,
  }),
);
