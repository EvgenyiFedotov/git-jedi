import { createFlagEvents } from "lib/added-effector";
import { createEvent } from "effector";

export const changeVisible = createFlagEvents();
export const addRemoteUrl = createEvent<void>();
export const changeRemoteUrl = createEvent<string>();
