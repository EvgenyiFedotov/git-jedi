import { createCommandEffect } from "lib/added-effector/command-effect";
import * as ef from "effector";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
};

export const gitStatus = createCommandEffect("git", () => [
  "status",
  "-s",
  "-u",
]);

export const loadStatusFiles = ef.createEvent<void>();

export const $statusFiles = ef.createStore<StatusFile[]>([]);
