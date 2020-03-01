import { createFlagStore } from "lib/added-effector";

import { changeVisibleRemoteUrl } from "./events";

export const $visibleRemoteUrl = createFlagStore(changeVisibleRemoteUrl);
