import { createStore, createEvent } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit } from "lib/run-command";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
};

export const unstage = createPipePromiseEffect<{ paths: string[] }>(
  ({ paths }, options) =>
    runCommandGit("reset", ["HEAD", "--", ...paths], options),
);

export const unstageChanges = createEvent<StatusFile>();
export const unstageAllChanges = createEvent<void>();

export const $stagedStatus = createStore<StatusFile[]>([]);
