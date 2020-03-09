import { createRunCommandEvent } from "features/run-command-options";
import { createEvent } from "effector";

import { getBranchList as getBranchListEffect } from "./effects";

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

export const getBranchList = createRunCommandEvent<object>(
  getBranchListEffect,
  () => ({}),
);
export const changeSearch = createEvent<string>();
export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();
