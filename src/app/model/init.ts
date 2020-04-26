import * as ef from "effector";
import { $workDir } from "features/settings";
import { runCurrentBranchName } from "features/branches";

ef.forward({
  from: $workDir,
  to: runCurrentBranchName,
});
