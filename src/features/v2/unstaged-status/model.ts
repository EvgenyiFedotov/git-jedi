import { createStore } from "effector";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
};

export const $unstagedStatus = createStore<StatusFile[]>([]);
