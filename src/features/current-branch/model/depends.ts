import { sample } from "effector";
import { $commandOptions } from "features/command-options";
import { RevParseOptions } from "lib/git-proxy/rev-parse";

import { init } from "./events";
import { revParse } from "./effects";

sample({
  source: $commandOptions,
  clock: init,
  fn: (commandOptions): RevParseOptions => ({
    commandOptions,
    mode: "commitHash",
  }),
  target: revParse,
});

revParse.done.watch(console.log);
