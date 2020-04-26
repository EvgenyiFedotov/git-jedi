import * as ef from "effector";
import { checkoutTo, Branch } from "features/commands";

export const commandCheckoutTo = ef.createEffect({
  handler: checkoutTo,
});

export const runCheckoutTo = ef.createEvent<{ branch: Branch }>();
