import { guard } from "effector";

import { $currentBranch } from "./stores";
import { updateCurrentBranch } from "./events";

guard({
  source: $currentBranch,
  filter: (value) => value === "HEAD",
  target: updateCurrentBranch.prepend((_: any) => ({
    mode: "commitHash",
  })),
});
