import { createEvent } from "effector";
import { PullOptions } from "lib/api-git";

export const pull = createEvent<PullOptions>();
export const pullEnd = createEvent<void>();
