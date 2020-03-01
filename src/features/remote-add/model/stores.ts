import { createFlagStore } from "lib/added-effector";
import { restore } from "effector";

import { changeVisible, changeRemoteUrl } from "./events";

export const $visible = createFlagStore(changeVisible);

export const $remoteUrl = restore(changeRemoteUrl, "");
