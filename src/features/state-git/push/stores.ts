import { createStore } from "effector";

import { push, pushEnd } from "./events";

export const $pendingPush = createStore<boolean>(false);

$pendingPush.on(push, () => true);
$pendingPush.on(pushEnd, () => false);
