import { createStore, restore } from "effector";

import { Command, addCommand, Option, changeValue } from "./events";

export const $commands = createStore<{ ref: Map<string, Command> }>({
  ref: new Map(),
});

$commands.on(addCommand, (store, command) => {
  if (store.ref.has(command.id)) {
    console.info("Double insert command", command.id);

    return store;
  }

  store.ref.set(command.id, command);

  return { ref: store.ref };
});

export const $options = createStore<Option[]>([]);

export const $value = restore(changeValue, "");
