import { createStore, createEvent } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit } from "lib/run-command";
import { DiffFile } from "lib/diff";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
  diff: DiffFile | null;
};

export const unstage = createPipePromiseEffect<{ paths: string[] }>(
  ({ paths }, options) =>
    runCommandGit("reset", ["HEAD", "--", ...paths], options),
);
export const diff = createPipePromiseEffect<string>((path, options) =>
  runCommandGit(
    "diff",
    ["--diff-algorithm=patience", "--cached", "--", path],
    options,
  ),
);

export const unstageChanges = createEvent<StatusFile>();
export const unstageAllChanges = createEvent<void>();
export const getDiff = createEvent<string>();

export const $stagedStatus = createStore<{ ref: Map<string, StatusFile> }>({
  ref: new Map(),
});
