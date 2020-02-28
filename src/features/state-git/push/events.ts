import { createEvent } from "effector";
import { PushOptions } from "lib/api-git";

export const push = createEvent<PushOptions>();
export const pushEnd = createEvent<void>();
