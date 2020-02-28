import { sample, forward } from "effector";
import { addCommand, createCommand } from "features/commands";

import { push as pushEffect } from "./effects";
import { push as pushEvent, pushEnd } from "./events";
import { $runCommandOptions } from "../config";

addCommand(createCommand("push", () => pushEvent({})));
addCommand(createCommand("push:force", () => pushEvent({ force: true })));

sample({
  source: $runCommandOptions,
  clock: pushEvent,
  fn: (options, optionsPush) => ({ ...options, ...optionsPush }),
  target: pushEffect,
});

forward({
  from: pushEffect.finally,
  to: pushEnd,
});
