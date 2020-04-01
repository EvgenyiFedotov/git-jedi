import * as ef from "effector";
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

export const loadCurrentBranch = ef.createEvent<void>();
export const loadCurrentBranchByHash = ef.createEvent<void>();

export const $currentBranch = ef.createStore<string>("");
