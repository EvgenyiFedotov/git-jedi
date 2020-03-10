import { createRunCommandEvent } from "features/settings";
import { createEvent } from "effector";

import * as effects from "./effects";

export type BranchGit<H = string> = {
  head: H;
  name: string;
  refName: string;
  objectName: string;
  objectType: string;
  push: string;
  remoteName: string;
};
export type Branch = BranchGit<boolean> & { remote?: Branch };
export type Option = BranchGit<boolean> & { value: string };

export const getBranchList = createRunCommandEvent(effects.getBranchList);
export const changeSearch = createEvent<string>();
export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();
export const checkoutBranch = createRunCommandEvent(effects.checkoutBranch);
export const checkoutBranchByBranch = createEvent<Branch>();
export const checkoutedBranch = createEvent<void>();
export const updateBranchList = createEvent<void>();
export const removeBranch = createRunCommandEvent(effects.removeBranch);
export const removeBranchByBranch = createEvent<Branch>();
