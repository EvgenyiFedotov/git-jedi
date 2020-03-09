import { sample, forward } from "effector";

import { changeSearch, Option, selectOption } from "./events";
import { $commands, $options, $value } from "./stores";

sample({
  source: $commands,
  clock: changeSearch,
  fn: ({ ref: commands }, search) => {
    const result = Array.from(commands.values()).reduce<Option[]>(
      (memo, command) => {
        if (search && !!command.title.toLocaleLowerCase().match(search)) {
          memo.push({ ...command, value: command.title });
        }

        return memo;
      },
      [],
    );

    return result;
  },
  target: $options,
});

forward({
  from: selectOption.map(() => ""),
  to: $value,
});

selectOption.watch(({ event }) => event());
