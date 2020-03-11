import { forward, sample, combine } from "effector";
import { $commands } from "features/v2/commands/model";

import { selectOption, $value, Option, $options } from ".";

sample({
  source: combine([$commands, $value]),
  clock: $value,
  fn: ([{ ref: commands }, search]) =>
    Array.from(commands.values()).reduce<Option[]>((memo, command) => {
      if (
        (search && !!command.title.toLocaleLowerCase().match(search)) ||
        !search
      ) {
        memo.push({ ...command, value: command.title });
      }

      return memo;
    }, []),
  target: $options,
});

forward({
  from: selectOption.map(() => ""),
  to: $value,
});

selectOption.watch(({ event }) => event());
