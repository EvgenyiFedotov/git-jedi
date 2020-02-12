import { createEvent } from "effector";

export const rebaseUp = createEvent<string>();
export const abortRebase = createEvent<void>();
export const rebaseEnd = createEvent<void>();
