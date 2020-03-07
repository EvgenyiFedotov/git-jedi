import { createEffect } from "effector";
import { HotKey } from "features/settings";
import mousetrap from "mousetrap";

import { Command } from "./events";

export const linkCommandWithHotkeys = createEffect<
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
