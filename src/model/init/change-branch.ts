import { attachRunCommand } from "../static/run-command";
import * as model from "../static/change-branch";

attachRunCommand({
  event: model.changeBranch,
  effect: model.checkoutTo,
});
