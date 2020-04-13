import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

export type Branch = {
  head: string;
  name: string;
  refName: string;
  objectName: string;
  objectType: string;
  push: string;
  remoteName: string;
  remote?: Branch;
};

export const gitBranchList = createCommandEffect("git", () => [
  "branch",
  "-l",
  "-a",
  `--format={"remoteName": "%(upstream:remotename)", "name": "%(refname:lstrip=2)", "refName": "%(refname)", "push": "%(push)", "objectType": "%(objecttype)", "head": "%(HEAD)", "objectName": "%(objectname)"},`,
]);

export const gitFetchP = createCommandEffect("git", () => ["fetch", "-p"]);

export const loadBranches = ef.createEvent<void>();
export const fetchP = ef.createEvent<void>();

export const $branches = ef.createStore<Map<string, Branch>>(new Map());
