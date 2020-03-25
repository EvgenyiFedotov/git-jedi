import { createStore } from "effector";
import { createCommand } from "features/v2/commands";
import { createCommandEffect } from "lib/added-effector/command-effect";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
};

export const gitStatusS = createCommandEffect("git", () => [
  "status",
  "-s",
  "-u",
]);

export const getStatusS = createCommand("status", "status");

export const $status = createStore<StatusFile[]>([]);
