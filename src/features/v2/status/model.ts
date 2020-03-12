import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit } from "lib/run-command";
import { createEvent, createStore } from "effector";
import { createCommand } from "features/v2/commands";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
};

export const gitStatusS = createPipePromiseEffect((_, options) =>
  runCommandGit("status", ["-s"], options),
);

export const getStatusS = createCommand("status", "status");

export const $status = createStore<StatusFile[]>([]);
