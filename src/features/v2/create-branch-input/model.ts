import { createEvent, restore, createStore } from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

export type Option = { value: string };

export const gitCreateBranch = createCommandEffect<{ branch: string }>(
  "git",
  ({ branch }) => ["checkout", "-b", branch],
);

export const changeValue = createEvent<string>();
export const selectOption = createEvent<Option>();
export const selectOptionByEnter = createEvent<void>();

export const $value = restore(changeValue, "");
export const $options = createStore<Option[]>([]);
