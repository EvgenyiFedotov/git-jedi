import { restore, createStore } from "effector";

import { changeValue, Option, changeCurrentBranch } from "./events";

export const $value = restore(changeValue, "");

export const $options = createStore<Option[]>([]);

export const $currentBranch = restore(changeCurrentBranch, "");
