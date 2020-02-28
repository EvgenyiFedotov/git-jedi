import { createEvent } from "effector";

import { Command } from "./stores";

export const addCommand = createEvent<Command>();
export const searchCommand = createEvent<string>();
export const selectCommand = createEvent<string>();
export const focusInput = createEvent<void>();
export const changeTextCommand = createEvent<string>();
