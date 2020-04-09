import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

export const diffPull = createCommandEffect<{ range: string }>(
  "git",
  ({ range }) => {
    return ["log", "--oneline", range];
  },
);

export const diffPush = createCommandEffect<{ range: string }>(
  "git",
  ({ range }) => {
    return ["log", "--oneline", range];
  },
);

export const $published = ef.createStore<boolean | null>(null);
export const $diffPull = ef.createStore<number>(0);
export const $diffPush = ef.createStore<number>(0);
export const $existRemote = ef.createStore<boolean>(false);
