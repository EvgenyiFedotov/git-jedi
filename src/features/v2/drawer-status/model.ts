import { createStore, createEvent } from "effector";
import { createCommand } from "features/v2/commands";

export const openStatus = createCommand("open status", "openStatus");
export const closeStatus = createEvent<void>();

export const $showStatus = createStore<boolean>(true);
