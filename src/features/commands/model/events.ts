import { createEvent, Event } from "effector";

export type Command = {
  id: string;
  title: string;
  event: Event<void>;
  hotKey?: { instance: MousetrapInstance; command: string };
};

export type Option = Command & { value: string };

export const addCommand = createEvent<Command>();
export const changeSearch = createEvent<string>();
export const selectOption = createEvent<Option>();
export const changeValue = createEvent<string>();
