import { forward } from "effector";
import { $status } from "features/v2/status";

import { $unstagedStatus } from "./model";

forward({
  from: $status.map((status) =>
    status
      .filter(
        (statusFile) =>
          (statusFile.stage === statusFile.unstage &&
            statusFile.unstage === "?") ||
          statusFile.stage === " ",
      )
      .map((statusFile) => {
        statusFile.unstage =
          statusFile.unstage === "?" ? "U" : statusFile.unstage;

        return statusFile;
      }),
  ),
  to: $unstagedStatus,
});
