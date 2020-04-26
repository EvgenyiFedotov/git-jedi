import * as ef from "effector";

import * as model from ".";

ef.forward({
  from: model.runBranchList,
  to: model.commandBranchList,
});

ef.forward({
  from: model.commandBranchList.done,
  to: model.runFetchP,
});

ef.forward({
  from: model.runFetchP,
  to: model.commandFetchP,
});

model.$branches.on(model.commandBranchList.done, (_, { result }) => result);
