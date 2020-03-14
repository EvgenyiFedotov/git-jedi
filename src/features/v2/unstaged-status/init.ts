import { forward } from "effector";
import { $status } from "features/v2/status";

import { $unstagedStatus } from "./model";

forward({
  from: $status.map((status) =>
    status.filter(
      ({ stage, unstage }) =>
        (stage === unstage && unstage === "?") || stage === " ",
    ),
  ),
  to: $unstagedStatus,
});
