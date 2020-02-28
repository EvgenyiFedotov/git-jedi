import { createPendingStore } from "lib/added-effector";

import { fetch } from "./effects";

export const $pendingFetch = createPendingStore(fetch);
