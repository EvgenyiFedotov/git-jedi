import { createStore, createEvent } from "effector";
import { createCommand } from "features/v2/commands";

export const openStatus = createCommand("open changes", "openChanges");
export const closeStatus = createEvent<void>();

export const $showStatus = createStore<boolean>(false);
