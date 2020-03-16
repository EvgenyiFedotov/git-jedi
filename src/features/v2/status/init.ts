import { createDependRunCommandOptions } from "features/v2/settings/model";
import { stage, discard } from "features/v2/unstaged-status/model";
import { forward, merge } from "effector";
import { unstage } from "features/v2/staged-status/model";

import { gitStatusS, getStatusS, $status } from "./model";

createDependRunCommandOptions({
  event: getStatusS,
  effect: gitStatusS,
});

forward({
  from: merge([stage.done, unstage.done, discard.done]),
  to: getStatusS,
});

$status.on(gitStatusS.done, (_, { result }) =>
  result
    .filter(({ action }) => action === "data")
    .map(({ value }) => value.split("\n"))
    .reduce((memo, lines) => [...memo, ...lines], [])
    .filter(Boolean)
    .map((line) => ({
      stage: line[0],
      unstage: line[1],
      path: line.slice(3),
    })),
);
