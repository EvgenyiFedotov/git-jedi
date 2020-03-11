import { sample, forward } from "effector";
import { $currentBranch } from "features/v2/current-branch/model";
import { createDependRunCommandOptions } from "features/v2/settings/model";

import {
  changeValue,
  $options,
  selectOption,
  $value,
  selectOptionByEnter,
  gitCreateBranch,
} from ".";

sample({
  source: $currentBranch,
  clock: changeValue,
  fn: (currentBranch, value) =>
    value
      ? [{ value: currentBranch ? `${value}/${currentBranch}` : value }]
      : [],
  target: $options,
});

forward({
  from: selectOption.map(() => ""),
  to: $value,
});

forward({
  from: selectOption.map(() => []),
  to: $options,
});

sample({
  source: $value,
  clock: selectOptionByEnter,
  fn: (value) => ({ value }),
  target: selectOption,
});

createDependRunCommandOptions({
  event: selectOption.map(({ value }) => ({ branch: value })),
  effect: gitCreateBranch,
});
