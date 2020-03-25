import { createStore, createEvent } from "effector";
import { DiffFile, DiffChunk, DiffLine } from "lib/diff";
import * as consts from "app/const";
import { createStageByPatch } from "lib/added-effector/stage-by-patch";
import { createCommandEffect } from "lib/added-effector/command-effect";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
  diff: DiffFile | null;
};

export const unstage = createCommandEffect<{ paths: string[] }>(
  "git",
  ({ paths }) => ["reset", "HEAD", "--", ...paths],
);

export const diff = createCommandEffect<string>("git", (path) => [
  "diff",
  "--diff-algorithm=patience",
  "--cached",
  "--",
  path,
]);

export const stageByPatchChunk = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});
export const stageByPatchLine = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});

export const unstageChanges = createEvent<StatusFile>();
export const unstageAllChanges = createEvent<void>();
export const getDiff = createEvent<string>();
export const showDiff = createEvent<string>();
export const hideDiff = createEvent<string>();
export const createPatchByChunk = createEvent<DiffChunk>();
export const createPatchByLine = createEvent<DiffLine>();

export const $stagedStatus = createStore<{ ref: Map<string, StatusFile> }>({
  ref: new Map(),
});
