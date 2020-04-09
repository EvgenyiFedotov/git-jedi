import * as ef from "effector";
import { createStageByPatch } from "lib/added-effector/stage-by-patch";
import { createCommandEffect } from "lib/added-effector/command-effect";
import * as consts from "app/const";
import { DiffChunk, DiffLine } from "lib/diff";

export const unstage = createCommandEffect<{ paths: string[] }>(
  "git",
  ({ paths }) => ["reset", "HEAD", "--", ...paths],
);

export const unstageByPatchChunk = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});

export const unstageByPatchLine = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});

export const unstageAll = ef.createEvent<void>();
export const unstageFile = ef.createEvent<string>();
export const unstageChunk = ef.createEvent<DiffChunk>();
export const unstageLine = ef.createEvent<DiffLine>();
