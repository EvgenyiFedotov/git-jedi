import { createEffect, combine, forward } from "effector";
import { HotKey, $hotKeys } from "features/v2/settings/model";
import mousetrap from "mousetrap";

import { $commands, addCommand, Command } from "./model";

const linkCommandWithHotkeys = createEffect<
  { commands: Map<string, Command>; hotKeys: HotKey[] },
  void
>({
  handler: ({ commands, hotKeys }) => {
    const commandHotKeys = hotKeys.filter(({ type }) => type === "command");

    commands.forEach((command) => {
      if (command.hotKey) {
        command.hotKey.instance.unbind(command.hotKey.command);
        delete command.hotKey;
      }
    });

    commandHotKeys.forEach((hotKey) => {
      const command = commands.get(hotKey.targetId);

      if (command) {
        command.hotKey = {
          instance: mousetrap.bind(hotKey.command, () => command.event()),
          command: hotKey.command,
        };
      }
    });
  },
});

const commandsHotKeys = combine(
  [$commands, $hotKeys],
  ([{ ref: commands }, hotKeys]) => ({
    commands,
    hotKeys,
  }),
);

forward({
  from: commandsHotKeys,
  to: linkCommandWithHotkeys,
});

$commands.on(addCommand, (store, command) => {
  if (store.ref.has(command.id)) {
    console.info("Double insert command", command.id);

    return store;
  }

  store.ref.set(command.id, command);

  return { ref: store.ref };
});
