import { createStore, createEvent } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit, commandPipeToPromise } from "lib/run-command";
import { DiffFile } from "lib/diff";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
  diff: DiffFile | null;
};

export const discard = createPipePromiseEffect<{ paths: string[] }>(
  async ({ paths }, options) => {
    await commandPipeToPromise(
      runCommandGit(
        "stash",
        ["push", "--keep-index", "--include-untracked", "--", ...paths],
        options,
      ),
    );
    return runCommandGit("stash", ["drop"], options);
  },
);
export const stage = createPipePromiseEffect<{ paths: string[] }>(
  ({ paths }, options) => runCommandGit("add", paths, options),
);
export const diff = createPipePromiseEffect<string>((path, options) =>
  runCommandGit("diff", ["--diff-algorithm=patience", "--", path], options),
);

export const discardChanges = createEvent<StatusFile>();
export const stageChanges = createEvent<StatusFile>();
export const discardAllChanges = createEvent<void>();
export const stageAllChanges = createEvent<void>();
export const getDiff = createEvent<string>();

export const $unstagedStatus = createStore<{ ref: Map<string, StatusFile> }>({
  ref: new Map(),
});
export const $discardingChanges = createStore<{ ref: Map<string, StatusFile> }>(
  { ref: new Map() },
);
