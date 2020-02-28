import { sample, forward } from "effector";

import { pull as pullEffect } from "./effects";
import { pull as pullEvent, pullEnd } from "./events";
import { $runCommandOptions } from "../config";

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
