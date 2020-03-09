import { restore, createStore } from "effector";

import { changeValue, Option } from "./events";

export const $value = restore(changeValue, "");

export const $options = createStore<Option[]>([]);
