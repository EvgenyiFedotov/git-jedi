import * as ef from "effector";
import { Params } from "lib/added-effector/command-effect";
import { ResultPromise } from "lib/create-command";
import { RunCommandOptions } from "lib/run-command";

import { $cwd } from "./settings";

export const $runCommandOptions = $cwd.map(
  (cwd): RunCommandOptions => ({
    spawnOptions: { cwd: cwd || "/" },
    commandOptions: {
      onBefore: ({ command, args = [] }) =>
        console.log([command, ...args].join(" ")),
      onClose: (code, { log, ...other }) => {
        if (code) {
          const strlog = log.map(({ data }) => data).join("\n");

          console.error(strlog);
          console.log(other);
        }
      },
    },
  }),
);

export const attachRunCommand = <P = void>(_: {
  event: ef.Event<P>;
  effect?: ef.Effect<Params<P>, ResultPromise>;
}) => {
  if (_.effect) {
    return ef.sample({
      source: $runCommandOptions,
      clock: _.event,
      fn: (options, params) => ({
        params,
        options,
      }),
      target: _.effect,
    });
  }

  return ef.sample({
    source: $runCommandOptions,
    clock: _.event,
    fn: (options, params) => ({
      params,
      options,
    }),
  });
};
