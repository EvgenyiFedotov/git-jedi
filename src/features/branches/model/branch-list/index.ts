import * as ef from "effector";
import { branchList, Branch, fetchP } from "features/commands";

// Effects
export const commandBranchList = ef.createEffect({
  handler: branchList,
});

export const commandFetchP = ef.createEffect({
  handler: fetchP,
});

// Events
export const runBranchList = ef.createEvent();
export const runFetchP = ef.createEvent();

// Stores
export const $branches = ef.createStore<Map<string, Branch>>(new Map());
