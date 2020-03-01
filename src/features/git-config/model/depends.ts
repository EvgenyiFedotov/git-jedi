import { forward, sample } from "effector";
import { createCommand, addCommand } from "features/commands";
import mousetrap from "mousetrap";

import {
  editConfig as editConfigEvent,
  showHideConfig,
  loadConfig,
} from "./events";
import { $runCommandOptions } from "features/state-git";
import { config } from "./effects";

addCommand(createCommand("config", () => editConfigEvent()));

mousetrap.bind("command+shift+,", () => editConfigEvent());

forward({
  from: editConfigEvent,
  to: showHideConfig.show,
});

sample({
  source: $runCommandOptions,
  clock: loadConfig,
  target: config,
});
