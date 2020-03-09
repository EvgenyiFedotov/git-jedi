import { guard, forward, merge } from "effector";
import { changedCwd } from "features/settings";
import { checkoutedBranch } from "features/branches";
// TODO Think about sturct model with depends
import { createdBranch } from "features/create-branch/model/events";

import { $currentBranch } from "./stores";
import { getCurrentBranch } from "./events";

guard({
  source: $currentBranch,
  filter: (value) => value === "HEAD",
  target: getCurrentBranch.prepend((_: any) => ({
    mode: "commitHash",
  })),
});

guard({
  source: changedCwd,
  filter: (cwd) => !!cwd,
  target: getCurrentBranch.prepend((_: any) => {}),
});

forward({
  from: merge([checkoutedBranch, createdBranch]),
  to: getCurrentBranch,
});
