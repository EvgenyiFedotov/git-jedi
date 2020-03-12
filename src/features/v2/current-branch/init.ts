import { merge, guard } from "effector";
import { createDependRunCommandOptions } from "features/v2/settings/model";
import { gitCheckout } from "features/v2/change-branch-input/model";
import { gitCreateBranch } from "features/v2/create-branch-input/model";

import {
  $currentBranch,
  gitCurrentBranchName,
  gitCurrentBranchHash,
  updateCurrentBranch,
  updateCurrentBranchByHash,
} from "./model";

createDependRunCommandOptions({
  event: merge([
    updateCurrentBranch,
    gitCheckout.done,
    gitCreateBranch.done,
  ]).map(() => {}),
  effect: gitCurrentBranchName,
});

guard({
  source: $currentBranch,
  filter: (value) => value === "HEAD",
  target: updateCurrentBranchByHash.prepend((_: any) => {}),
});

createDependRunCommandOptions({
  event: updateCurrentBranchByHash,
  effect: gitCurrentBranchHash,
});

$currentBranch.on(gitCurrentBranchName.done, (_, { result }) =>
  toCurrentBranch(result[0].value),
);
$currentBranch.on(gitCurrentBranchHash.done, (_, { result }) =>
  toCurrentBranch(result[0].value).slice(0, 8),
);
$currentBranch.on(
  merge([gitCurrentBranchName.fail, gitCurrentBranchHash.fail]),
  () => "",
);

function toCurrentBranch(value: string): string {
  return value.replace("\n", "").trim();
}
