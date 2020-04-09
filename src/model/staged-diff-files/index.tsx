import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";
import { DiffFile } from "lib/diff";

export const stagedDiff = createCommandEffect<string>("git", (path) => [
  "diff",
  "--diff-algorithm=patience",
  "--cached",
  "--",
  path,
]);

export const loadStageDiff = ef.createEvent<string>();

export const $stagedDiffs = ef.createStore<{
  ref: Map<string, DiffFile>;
}>({ ref: new Map() });
