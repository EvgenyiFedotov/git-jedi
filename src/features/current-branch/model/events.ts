import { createRunCommandEvent } from "features/settings";
import { RevParseParams } from "lib/git-proxy/rev-parse";

import { revParse } from "./effects";

export const updateCurrentBranch = createRunCommandEvent<RevParseParams>(
  revParse,
  () => ({
    mode: "branch",
  }),
);
