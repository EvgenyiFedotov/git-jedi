import { createEvent, createStore } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit } from "lib/run-command";
import { DiffFile } from "lib/diff";

export type DiffParams = {
  paths: string[];
};

export type DiffStore = {
  unstaged: Map<string, DiffFile>;
  staged: Map<string, DiffFile>;
};

export const diff = createPipePromiseEffect<DiffParams>(({ paths }, options) =>
  runCommandGit("diff", ["--diff-algorithm=patience", "--", ...paths], options),
);

export const diffCached = createPipePromiseEffect<DiffParams>(
  ({ paths }, options) =>
    runCommandGit(
      "diff",
      ["--diff-algorithm=patience", "--cached", "--", ...paths],
      options,
    ),
);

export const getDiff = createEvent<DiffParams>();
export const getDiffChaced = createEvent<DiffParams>();

export const $diff = createStore<DiffStore>({
  unstaged: new Map(),
  staged: new Map(),
});
