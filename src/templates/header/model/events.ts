import { createCommand } from "features/commands";
import { createEvent } from "effector";

export type Mode = "command" | "branch";

export const changeBranch = createCommand("change branch", "changeBranch");
export const insertCommand = createEvent<void>();
