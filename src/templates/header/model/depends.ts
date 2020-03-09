import { forward } from "effector";

import { changeBranch, Mode, insertCommand } from "./events";
import { $mode } from "./stores";

forward({
  from: changeBranch.map<Mode>(() => "branch"),
  to: $mode,
});

forward({
  from: insertCommand.map<Mode>(() => "command"),
  to: $mode,
});
