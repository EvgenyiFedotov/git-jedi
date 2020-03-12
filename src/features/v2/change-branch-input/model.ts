import { createEvent, createStore, restore } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandPipe } from "lib/run-command";

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

export const gitCheckout = createPipePromiseEffect<{ branch: string }>(
  ({ branch }, options) => runCommandPipe("git", ["checkout", branch], options),
);

export const changeSearch = createEvent<string>();
export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();

export const $options = createStore<Option[]>([]);
export const $value = restore(changeValue, "");
