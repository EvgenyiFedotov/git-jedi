import { createStore, restore, createEvent } from "effector";

import { Command } from "features/v2/commands/model";

export type Option = Command & { value: string };

export const changeSearch = createEvent<string>();
export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();

export const $options = createStore<Option[]>([]);
export const $value = restore(changeValue, "");
