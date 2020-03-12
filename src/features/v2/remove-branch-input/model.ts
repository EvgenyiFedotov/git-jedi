import { createEvent, createStore, restore } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit } from "lib/run-command";

export type Option = {
  head: boolean;
  name: string;
  refName: string;
  objectName: string;
  objectType: string;
  push: string;
  remoteName: string;
  value: string;
  isRemote: boolean;
};

export const gitRemoveBranchD = createPipePromiseEffect<{ branch: string }>(
  ({ branch }, options) => runCommandGit("branch", ["-D", branch], options),
);

export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();

export const $options = createStore<Option[]>([]);
export const $value = restore(changeValue, "");
