import { sample, combine, forward, merge } from "effector";
import { $branches } from "features/v2/branches/model";
import { createDependRunCommandOptions } from "features/v2/settings/model";

import { $value, $options, selectOption, gitRemoveBranchD } from "./model";

sample({
  source: combine([$branches, $value]),
  clock: merge([$branches, $value]),
  fn: ([{ ref: branchList }, search]) =>
    Array.from(branchList.values())
      .filter(({ name }) =>
        search ? !!name.toLocaleLowerCase().match(search) : true,
      )
      .map((branch) => ({
        ...branch,
        value: branch.name,
      })),
  target: $options,
});

forward({
  from: selectOption.map(() => ""),
  to: $value,
});

createDependRunCommandOptions({
  event: selectOption.map(({ name }) => ({ branch: name })),
  effect: gitRemoveBranchD,
});
