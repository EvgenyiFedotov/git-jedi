import { createEvent, Event, createStore } from "effector";
import { v4 as uuid } from "uuid";

export type Command = {
  id: string;
  title: string;
  event: Event<void>;
  hotKey?: { instance: MousetrapInstance; command: string };
};

export const createCommand = (title: string, id: string = uuid()) => {
  const event = createEvent<void>();

  addCommand({ id, title, event });

  return event;
};

export const addCommand = createEvent<Command>();

export const $commands = createStore<{ ref: Map<string, Command> }>({
  ref: new Map(),
});
