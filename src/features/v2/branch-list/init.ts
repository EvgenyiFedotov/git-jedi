import * as ef from "effector";
import { loadBranches } from "features/v2/branches/model";

import * as model from "./model";

import { createDependRunCommandOptions } from "features/v2/settings/model";

createDependRunCommandOptions({
  event: model.changeBranch,
  effect: model.checkoutTo,
});

ef.forward({
  from: model.checkoutTo.done.map(() => {}),
  to: loadBranches,
});
