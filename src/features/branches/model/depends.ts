import { sample, forward, merge } from "effector";
import { changedCwd } from "features/settings";

import { $branchList, $options, $value } from "./stores";
import {
  changeSearch,
  selectOption,
  checkoutedBranch,
  checkoutBranch as checkoutBranchEvent,
  getBranchList,
} from "./events";
import { checkoutBranch as checkoutBranchEffect } from "./effects";

sample({
  source: $branchList,
  clock: changeSearch,
  fn: (branchList, search) =>
    branchList
      .filter(({ name }) =>
        search ? !!name.toLocaleLowerCase().match(search) : true,
      )
      .map((branch) => ({
        ...branch,
        value: branch.name,
      })),
  target: $options,
});

sample({
  source: $branchList,
  clock: merge([selectOption, $branchList]),
  fn: (branchList) =>
    branchList.map((branch) => ({
      ...branch,
      value: branch.name,
    })),
  target: $options,
});

forward({
  from: selectOption.map(() => ""),
  to: $value,
});

forward({
  from: selectOption.map(({ name }) => ({ branch: name })),
  to: checkoutBranchEvent,
});

forward({
  from: checkoutBranchEffect.done.map(() => {}),
  to: checkoutedBranch,
});

forward({
  from: merge([checkoutedBranch, changedCwd]).map(() => ({})),
  to: getBranchList,
});
