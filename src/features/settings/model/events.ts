import { createEvent } from "effector";

export const init = createEvent<void>();
export const selectCwd = createEvent<void>();
export const changedCwd = createEvent<string | null>();
