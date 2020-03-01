import { createStore } from "effector";

import { pull, pullEnd } from "./events";

export const $pendingPull = createStore<boolean>(false);

$pendingPull.on(pull, () => true);
$pendingPull.on(pullEnd, () => false);
