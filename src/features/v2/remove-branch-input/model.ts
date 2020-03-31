import { createEvent, createStore, restore } from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

export type Option = {
  head: boolean;
  name: string;
  refName: string;
  objectName: string;
  objectType: string;
  push: string;
  remoteName: string;
  value: string;
};

export const gitRemoveBranchD = createCommandEffect<{ branch: string }>(
  "git",
  ({ branch }) => ["branch", "-D", branch],
);

export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();

export const $options = createStore<Option[]>([]);
export const $value = restore(changeValue, "");
