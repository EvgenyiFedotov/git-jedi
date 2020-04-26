import "./current-branch/init";
import "./branch-list/init";
import "./change-branch/init";

import * as ef from "effector";
import { commandCheckoutTo } from "./change-branch";
import { runCurrentBranchName } from "./current-branch";
import { runBranchList } from "./branch-list";

ef.forward({
  from: commandCheckoutTo.done,
  to: [runCurrentBranchName, runBranchList],
});
