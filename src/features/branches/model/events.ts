import { createRunCommandEvent } from "features/run-command-options";
import { createEvent } from "effector";

import {
  getBranchList as getBranchListEffect,
  checkoutBranch as checkoutBranchEffect,
} from "./effects";

export type BranchGit<H = string> = {
  head: H;
  name: string;
  refName: string;
  objectName: string;
  objectType: string;
  push: string;
};
export type Branch = BranchGit<boolean>;
export type Option = BranchGit<boolean> & { value: string };

export const getBranchList = createRunCommandEvent(getBranchListEffect);
export const changeSearch = createEvent<string>();
export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();
export const checkoutBranch = createRunCommandEvent(checkoutBranchEffect);
export const checkoutedBranch = createEvent<void>();
