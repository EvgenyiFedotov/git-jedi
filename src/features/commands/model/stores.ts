import { createStore } from "effector";

import { addCommand } from "./events";

export interface Command {
  id: string;
  name: string;
  run: () => any;
}

export const $commands = createStore<{ ref: Map<string, Command> }>({
  ref: new Map(),
});

$commands.on(addCommand, (store, command) => {
  if (!store.ref.has(command.id)) {
    store.ref.set(command.id, command);

    return { ref: store.ref };
  }

  return store;
});

export const $filteredCommands = createStore<Command[]>([]);
