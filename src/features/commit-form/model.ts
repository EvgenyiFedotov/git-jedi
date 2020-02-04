import { createStore } from "effector";

export const $types = createStore<string[]>([
  "feat",
  "fix",
  "build",
  "chore",
  "ci",
  "docs",
  "style",
  "refactor",
  "test",
]);
