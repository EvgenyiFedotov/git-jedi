import { createEvent } from "effector";

export const createCommit = createEvent<string>();
export const logUpdated = createEvent<void>();
