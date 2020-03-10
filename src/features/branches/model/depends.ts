import { sample, forward, merge, guard } from "effector";

import { $branchList, $options, $value } from "./stores";
import * as events from "./events";
import * as effects from "./effects";

sample({
  source: $branchList,
  clock: events.changeSearch,
  fn: ({ ref: branchList }, search) =>
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

sample({
  source: $branchList,
  clock: merge([events.selectOption, $branchList]),
  fn: ({ ref: branchList }) =>
    Array.from(branchList.values()).map((branch) => ({
      ...branch,
      value: branch.name,
    })),
  target: $options,
});

forward({
  from: events.selectOption.map(() => ""),
  to: $value,
});

forward({
  from: events.selectOption.map(({ name }) => ({ branch: name })),
  to: events.checkoutBranch,
});

forward({
  from: effects.checkoutBranch.done.map(() => {}),
  to: events.checkoutedBranch,
});

forward({
  from: merge([events.updateBranchList, effects.removeBranch.done]),
  to: events.getBranchList,
});

guard({
  source: events.removeBranchByBranch,
  filter: ({ isRemote }) => !isRemote,
  target: events.removeBranch.prepend(({ name }: events.Branch) => ({
    branch: name,
  })),
});

const removeRemote = guard({
  source: events.removeBranchByBranch,
  filter: ({ isRemote }) => isRemote,
});

// TODO add remove remote branch
removeRemote.watch((branch) => console.log("remove-remote:", branch));

forward({
  from: events.publishBranchByBranch.map(({ name }) => ({
    remote: "origin",
    branch: name,
  })),
  to: events.publishBranch,
});

forward({
  from: events.push,
  to: events.pushCurrentBranch,
});
