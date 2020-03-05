import { createRunCommandEvent } from "features/command-options";
import { RevParseParams } from "lib/git-proxy/rev-parse";

import { revParse } from "./effects";

export const getCurrentBranch = createRunCommandEvent<RevParseParams>(
  revParse,
  () => ({
    mode: "branch",
  }),
);
