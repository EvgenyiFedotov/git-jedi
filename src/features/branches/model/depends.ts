import { sample, forward, merge } from "effector";

import { $branchList, $options, $value } from "./stores";
import { changeSearch, selectOption } from "./events";

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
