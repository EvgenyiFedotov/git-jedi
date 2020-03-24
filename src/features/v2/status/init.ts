import { createDependRunCommandOptions } from "features/v2/settings/model";

import { gitStatusS, getStatusS, $status } from "./model";

createDependRunCommandOptions({
  event: getStatusS,
  effect: gitStatusS,
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
