import { createStore, createEvent } from "effector";

import { creatingBranch } from "./model";

export const $isShowButton = createStore<boolean>(true);

export const showButton = createEvent<any>();
export const hideButton = createEvent<any>();

$isShowButton.on(showButton, () => true);
$isShowButton.on(hideButton, () => false);
$isShowButton.on(creatingBranch.done, () => true);
