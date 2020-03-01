import { sample, forward } from "effector";

import { $runCommandOptions } from "./config";
import { fetch as fetchEvent, fetchEnd } from "./events";
import { fetch as fetchEffect } from "./effects";

sample({
  source: $runCommandOptions,
  clock: fetchEvent,
  target: fetchEffect,
});

forward({
  from: fetchEffect.finally,
  to: fetchEnd,
});
