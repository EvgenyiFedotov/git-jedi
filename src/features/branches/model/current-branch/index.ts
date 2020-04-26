import * as ef from "effector";
import { currentBranchHash, currentBranchName } from "features/commands";

export const commandCurrenBranchHash = ef.createEffect({
  handler: currentBranchHash,
});

export const commandCurrenBranchName = ef.createEffect({
  handler: currentBranchName,
});

export const runCurrentBranchName = ef.createEvent<void>();
export const runCurrentBranchHash = ef.createEvent<void>();

export const $currentBranch = ef.createStore<string>("");
