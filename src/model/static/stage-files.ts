import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";
import * as consts from "app/const";
import { createStageByPatch } from "lib/added-effector/stage-by-patch";
import { DiffChunk, DiffLine } from "lib/diff";

export const stage = createCommandEffect<{ paths: string[] }>(
  "git",
  ({ paths }) => ["add", ...paths],
);

export const stageByPatchChunk = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});

export const stageByPatchLine = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});

export const stageAll = ef.createEvent<void>();
export const stageFile = ef.createEvent<string>();
export const stageChunk = ef.createEvent<DiffChunk>();
export const stageLine = ef.createEvent<DiffLine>();
