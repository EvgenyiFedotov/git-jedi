import { createEffect } from "effector";
import { reset, ResetOptions } from "lib/api-git";

export const unstaging = createEffect<ResetOptions, string>({
  handler: (options) => reset(options),
});
export const unstagingAll = createEffect<ResetOptions, string>({
  handler: (options) => reset(options),
});
