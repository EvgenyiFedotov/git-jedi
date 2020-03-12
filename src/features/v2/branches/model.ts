import { createStore, createEvent } from "effector";
import { runCommandPipe } from "lib/run-command";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";

export type BranchGit<H = string> = {
  head: H;
  name: string;
  refName: string;
  objectName: string;
  objectType: string;
  push: string;
  remoteName: string;
};
export type Branch = BranchGit<boolean> & { isRemote: boolean };

export const gitBranches = createPipePromiseEffect((_, options) =>
  runCommandPipe(
    "git",
    [
      "branch",
      "-l",
      "-a",
      `--format={"remoteName": "%(upstream:remotename)", "name": "%(refname:lstrip=2)", "refName": "%(refname)", "push": "%(push)", "objectType": "%(objecttype)", "head": "%(HEAD)", "objectName": "%(objectname)"},`,
    ],
    options,
  ),
);

export const loadBranches = createEvent<void>();

export const $branches = createStore<{ ref: Map<string, Branch> }>({
  ref: new Map(),
});
