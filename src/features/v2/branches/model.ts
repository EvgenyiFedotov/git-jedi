import { createStore, createEvent } from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

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

export const gitBranches = createCommandEffect("git", () => [
  "branch",
  "-l",
  "-a",
  `--format={"remoteName": "%(upstream:remotename)", "name": "%(refname:lstrip=2)", "refName": "%(refname)", "push": "%(push)", "objectType": "%(objecttype)", "head": "%(HEAD)", "objectName": "%(objectname)"},`,
]);

export const loadBranches = createEvent<void>();

export const $branches = createStore<{ ref: Map<string, Branch> }>({
  ref: new Map(),
});
