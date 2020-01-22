import { createStore, createEvent } from "effector";

export const $isShowChanges = createStore<boolean>(true);

export const toggleIsShowChanges = createEvent<any>();

$isShowChanges.on(toggleIsShowChanges, prev => !prev);
