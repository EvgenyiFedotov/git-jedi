import { createStore, createEvent } from "effector";
import { createCommand } from "features/v2/commands";

export const openBranchList = createCommand(
  "open branch list",
  "openBranchList",
);
export const closeBranchList = createEvent<void>();

export const $showBranchList = createStore<boolean>(false);
