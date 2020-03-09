import { createCommand } from "features/commands";
import { createEvent } from "effector";

export type Mode = "command" | "branch" | "create-branch";

export const changeBranch = createCommand("change branch", "changeBranch");
export const createBranch = createCommand("create branch", "createBranch");
export const insertCommand = createEvent<void>();
