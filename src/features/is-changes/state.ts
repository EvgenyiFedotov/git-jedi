import { createStore, createEvent, forward } from "effector";

export const $isShowStatus = createStore<boolean>(false);
export const $isShowBranches = createStore<boolean>(false);

export const showStatus = createEvent<boolean>();
export const showBranches = createEvent<boolean>();

forward({ from: showStatus, to: $isShowStatus });
forward({ from: showBranches, to: $isShowBranches });
