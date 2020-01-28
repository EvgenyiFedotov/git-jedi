import { combine } from "effector";

import { $status } from "./status";

export const $isChanged = combine($status, (status) => !!status.length);
