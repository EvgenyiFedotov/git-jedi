import { forward } from "effector";

import { logUpdated } from "./events";
import { log } from "./original";

forward({
  from: log.finally,
  to: logUpdated,
});
