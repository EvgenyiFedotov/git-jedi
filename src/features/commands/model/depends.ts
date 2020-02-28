import { sample, guard } from "effector";

import { searchCommand, selectCommand, focusInput } from "./events";
import { $commands, $filteredCommands, Command } from "./stores";
import { runCommand } from "./effects";

sample({
  source: $commands,
  clock: searchCommand,
  fn: ({ ref: commands }, search) => {
    const result = Array.from(commands.values()).reduce<Command[]>(
      (memo, command) => {
        if (search && !!command.name.toLocaleLowerCase().match(search)) {
          memo.push(command);
        }

        return memo;
      },
      [],
    );

    return result;
  },
  target: $filteredCommands,
});

guard({
  source: sample({
    source: $commands,
    clock: selectCommand,
    fn: ({ ref: commands }, id) => commands.get(id),
  }),
  filter: (command) => !!command,
  target: runCommand,
});

sample({
  source: $commands,
  clock: focusInput,
  fn: ({ ref }) => Array.from(ref.values()),
  target: $filteredCommands,
});
