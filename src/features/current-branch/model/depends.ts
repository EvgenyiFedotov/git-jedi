import { guard } from "effector";
import { changedCwd } from "features/settings";

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
