import { sample, forward } from "effector";

import {
  changeValue,
  selectOption,
  createBranch as createBranchEvent,
  createdBranch,
  selectOptionByEnter,
} from "./events";
import { $options, $value, $currentBranch } from "./stores";
import { createBranch as createBranchEffect } from "./effect";

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

forward({
  from: selectOption.map(({ value }) => ({ branch: value })),
  to: createBranchEvent,
});

forward({
  from: createBranchEffect.done,
  to: createdBranch,
});

sample({
  source: $value,
  clock: selectOptionByEnter,
  fn: (value) => ({ value }),
  target: selectOption,
});