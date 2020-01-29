import { createEffect } from "effector";
import { add, AddOptions } from "lib/api-git";

export const staging = createEffect<AddOptions, string>({
  handler: (options) => add(options),
});
export const stagingAll = createEffect<AddOptions, string>({
  handler: (options) => add(options),
});
