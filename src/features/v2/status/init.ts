import {
  createDependRunCommandOptions,
  $cwd,
} from "features/v2/settings/model";
import * as ef from "effector";

import { gitStatusS, getStatusS, $status } from "./model";

createDependRunCommandOptions({
  event: ef.merge([getStatusS, $cwd]).map(() => {}),
  effect: gitStatusS,
});

$status.on(gitStatusS.done, (_, { result }) =>
  result
    .data()
    .map((value) => value.split("\n"))
    .reduce((memo, lines) => [...memo, ...lines], [])
    .filter(Boolean)
    .map((line) => ({
      stage: line[0],
      unstage: line[1],
      path: line.slice(3),
    })),
);
