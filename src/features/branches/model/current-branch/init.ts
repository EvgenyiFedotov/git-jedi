import * as ef from "effector";

import * as model from ".";

ef.forward({
  from: model.runCurrentBranchName,
  to: model.commandCurrenBranchName,
});

ef.guard({
  source: model.$currentBranch,
  filter: (value) => value === "HEAD",
  target: model.runCurrentBranchHash.prepend((_: any) => {}),
});

ef.forward({
  from: model.runCurrentBranchHash,
  to: model.commandCurrenBranchHash,
});

model.$currentBranch.on(
  model.commandCurrenBranchName.done,
  (_, { result }) => result,
);

model.$currentBranch.on(
  model.commandCurrenBranchHash.done,
  (_, { result }) => result,
);

model.$currentBranch.reset(
  ef.merge([
    model.commandCurrenBranchName.fail,
    model.commandCurrenBranchHash.fail,
  ]),
);
