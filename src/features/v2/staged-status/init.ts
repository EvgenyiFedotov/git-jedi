import { forward, sample } from "effector";
import { $status } from "features/v2/status";
import { createDependRunCommandOptions } from "features/v2/settings/model";

import {
  $stagedStatus,
  unstage,
  unstageChanges,
  unstageAllChanges,
} from "./model";

forward({
  from: $status.map((status) =>
    status.filter(({ unstage }) => unstage === " "),
  ),
  to: $stagedStatus,
});

createDependRunCommandOptions({
  event: unstageChanges.map(({ path }) => ({ paths: [path] })),
  effect: unstage,
});

createDependRunCommandOptions({
  event: sample($stagedStatus, unstageAllChanges).map((status) =>
    status.reduce<{ paths: string[] }>(
      (memo, { path }) => {
        memo.paths.push(path);
        return memo;
      },
      { paths: [] },
    ),
  ),
  effect: unstage,
});
