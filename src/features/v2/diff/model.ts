import { createEvent, createStore } from "effector";
import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit } from "lib/run-command";
import { Change } from "diff";

export type ScopeLineBy = {
  numLine: number | null;
  line: string | null;
  changed: boolean;
};
export type ScopeLine = {
  id: string;
  action: null | "removed" | "added";
  line: string;
  removedNumLine: number | null;
  addedNumLine: number | null;
  diff: Change[] | null;
};
export type DiffChunk = {
  id: string;
  header: string;
  lines: string[];
  scopeLines: ScopeLine[];
};
export type DiffFile = {
  path: string;
  info: string;
  chunks: DiffChunk[];
};

export type DiffParams = {
  refs: string[];
  paths: string[];
};

export const diff = createPipePromiseEffect<DiffParams>(
  ({ refs, paths }, options) =>
    runCommandGit(
      "diff",
      ["--diff-algorithm=patience", ...refs, "--", ...paths],
      options,
    ),
);

export const getDiff = createEvent<DiffParams>();

export const $diff = createStore<{ ref: Map<string, DiffFile> }>({
  ref: new Map(),
});
