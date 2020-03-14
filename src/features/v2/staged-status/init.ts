import { forward } from "effector";
import { $status } from "features/v2/status";

import { $stagedStatus } from "./model";

forward({
  from: $status.map((status) =>
    status.filter(({ unstage }) => unstage === " "),
  ),
  to: $stagedStatus,
});
