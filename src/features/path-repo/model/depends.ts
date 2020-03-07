import { forward } from "effector";
import { selectCwd } from "features/settings";

import { changePathRepo } from "./events";

forward({
  from: changePathRepo,
  to: selectCwd,
});
