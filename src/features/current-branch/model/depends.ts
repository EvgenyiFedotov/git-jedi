import { guard } from "effector";

import { $currentBranch } from "./stores";
import { getCurrentBranch } from "./events";

guard({
  source: $currentBranch,
  filter: (value) => value === "HEAD",
  target: getCurrentBranch.prepend((_: any) => ({
    mode: "commitHash",
  })),
});
