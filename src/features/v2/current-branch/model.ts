import { createStore, createEvent } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandPipe } from "lib/run-command";

export const gitCurrentBranchName = createPipePromiseEffect((_, options) =>
  runCommandPipe("git", ["rev-parse", "--abbrev-ref", "HEAD"], options),
);
export const gitCurrentBranchHash = createPipePromiseEffect((_, options) =>
  runCommandPipe("git", ["rev-parse", "--verify", "HEAD"], options),
);

export const updateCurrentBranch = createEvent<void>();
export const updateCurrentBranchByHash = createEvent<void>();

export const $currentBranch = createStore<string>("");
