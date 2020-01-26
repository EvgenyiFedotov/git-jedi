import { createStore, createEvent } from "effector";

export const $isShowButton = createStore<boolean>(true);

export const showButton = createEvent<any>();
export const hideButton = createEvent<any>();

$isShowButton.on(showButton, () => true).on(hideButton, () => false);
