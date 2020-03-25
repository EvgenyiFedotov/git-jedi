import { createStore, createEvent } from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

export const gitCurrentBranchName = createCommandEffect("git", () => [
  "rev-parse",
  "--abbrev-ref",
  "HEAD",
]);

export const gitCurrentBranchHash = createCommandEffect("git", () => [
  "rev-parse",
  "--verify",
  "HEAD",
]);

export const updateCurrentBranch = createEvent<void>();
export const updateCurrentBranchByHash = createEvent<void>();

export const $currentBranch = createStore<string>("");
