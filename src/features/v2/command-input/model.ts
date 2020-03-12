import { createStore, restore, createEvent, Event } from "effector";

export type Option = {
  id: string;
  title: string;
  event: Event<void>;
  hotKey?: { instance: MousetrapInstance; command: string };
  value: string;
};

export const changeSearch = createEvent<string>();
export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();

export const $options = createStore<Option[]>([]);
export const $value = restore(changeValue, "");
