import { sample, forward } from "effector";
import { createCommand, addCommand } from "features/commands";

import { pull as pullEffect } from "./effects";
import { pull as pullEvent, pullEnd } from "./events";
import { $runCommandOptions } from "../config";

addCommand(createCommand("pull", () => pullEvent({})));
addCommand(createCommand("pull --rebase", () => pullEvent({ rebase: true })));

sample({
  source: $runCommandOptions,
  clock: pullEvent,
  fn: (options, optionsPull) => ({ ...options, ...optionsPull }),
  target: pullEffect,
});

forward({
  from: pullEffect.finally,
  to: pullEnd,
});
