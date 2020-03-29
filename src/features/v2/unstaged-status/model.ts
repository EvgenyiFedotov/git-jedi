import { createStore, createEvent } from "effector";
import { DiffFile, DiffChunk, DiffLine } from "lib/diff";
import * as consts from "app/const";
import { createStageByPatch } from "lib/added-effector/stage-by-patch";
import { createCommandEffect } from "lib/added-effector/command-effect";
import { createCommand } from "lib/create-command";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
  diff: DiffFile | null;
};

export const discard = createCommandEffect<{ paths: string[] }>({
  command: async ({ params: { paths }, options }) => {
    await createCommand(
      "git",
      ["stash", "push", "--keep-index", "--include-untracked", "--", ...paths],
      options,
    )
      .run()
      .promise();

    return createCommand("git", ["stash", "drop"], options);
  },
});

export const stage = createCommandEffect<{ paths: string[] }>(
  "git",
  ({ paths }) => ["add", ...paths],
);

export const diff = createCommandEffect<StatusFile>({
  command: async ({ params: { path, unstage }, options }) => {
    if (unstage === "?") {
      await createCommand("git", ["add", path], options)
        .run()
        .promise();

      const result = await createCommand(
        "git",
        ["diff", "--diff-algorithm=patience", "--cached", "--", path],
        options,
      )
        .run()
        .promise();

      await createCommand("git", ["reset", "HEAD", "--", path], options)
        .run()
        .promise();

      return result;
    }

    return createCommand(
      "git",
      ["diff", "--diff-algorithm=patience", "--", path],
      options,
    );
  },
});

export const stageByPatchChunk = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});
export const stageByPatchLine = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});

export const discardChanges = createEvent<StatusFile>();
export const stageChanges = createEvent<StatusFile>();
export const stageChangesByDir = createEvent<string>();
export const discardAllChanges = createEvent<void>();
export const stageAllChanges = createEvent<void>();
export const getDiff = createEvent<StatusFile>();
export const showDiff = createEvent<string>();
export const hideDiff = createEvent<string>();
export const createPatchByChunk = createEvent<DiffChunk>();
export const createPatchByLine = createEvent<DiffLine>();
export const editAddEditPatch = createEvent<{ path: string }>();

export const $unstagedStatus = createStore<{ ref: Map<string, StatusFile> }>({
  ref: new Map(),
});
export const $discardingChanges = createStore<{ ref: Map<string, StatusFile> }>(
  { ref: new Map() },
);
