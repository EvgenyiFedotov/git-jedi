import { createStore } from "effector";

import { Mode } from "./events";

export const $mode = createStore<Mode>("command");
