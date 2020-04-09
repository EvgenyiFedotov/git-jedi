import { attachRunCommand } from "../run-command";
import * as st from ".";

attachRunCommand({
  event: st.changeBranch,
  effect: st.checkoutTo,
});
