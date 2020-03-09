import { guard, forward } from "effector";
import { changedCwd } from "features/settings";
import { checkoutedBranch } from "features/branches";

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
  from: checkoutedBranch,
  to: getCurrentBranch,
});
