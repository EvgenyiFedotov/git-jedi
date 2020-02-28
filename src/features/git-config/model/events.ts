import { createEvent } from "effector";
import { createFlagEvents } from "lib/added-effector";

export const editConfig = createEvent<void>();
export const showHideConfig = createFlagEvents();
export const loadConfig = createEvent<void>();
