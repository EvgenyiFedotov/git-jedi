import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

export type Remote = {
  fetch: string;
  url: string;
};

export const commandConfigL = createCommandEffect("git", () => [
  "config",
  "-l",
]);

export const loadConfig = ef.createEvent<void>();

export const $config = ef.createStore<Map<string, string> | null>(null);
export const $remotes = ef.createStore<Map<string, Remote>>(new Map());
