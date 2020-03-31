import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

export const checkoutTo = createCommandEffect<{ branch: string }>(
  "git",
  ({ branch }) => ["checkout", branch],
);

export const changeBranch = ef.createEvent<{ branch: string }>();
