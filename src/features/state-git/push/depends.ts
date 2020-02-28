import { sample, forward } from "effector";

import { push as pushEffect } from "./effects";
import { push as pushEvent, pushEnd } from "./events";
import { $runCommandOptions } from "../config";

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
