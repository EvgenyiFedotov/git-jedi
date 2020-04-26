import * as ef from "effector";

import * as model from ".";

ef.forward({
  from: model.runCheckoutTo,
  to: model.commandCheckoutTo,
});
