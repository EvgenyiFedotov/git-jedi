import { createEvent, restore, createStore } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandPipe } from "lib/run-command";

export type Option = { value: string };

export const gitCreateBranch = createPipePromiseEffect<{ branch: string }>(
  ({ branch }, options) =>
    runCommandPipe("git", ["checkout", "-b", branch], options),
);

export const changeValue = createEvent<string>();
export const selectOption = createEvent<Option>();
export const selectOptionByEnter = createEvent<void>();

export const $value = restore(changeValue, "");
export const $options = createStore<Option[]>([]);
