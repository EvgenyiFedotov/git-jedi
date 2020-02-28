import { createStore } from "effector";
import { createFlagStore } from "lib/added-effector";
import { Config } from "lib/api-git";

import { showHideConfig } from "./events";
import { config } from "./effects";

export const $isShowConfig = createFlagStore(showHideConfig);

export const $config = createStore<Config>({});

$config.on(config.done, (_, { result }) => result);
