import { createStore, createEvent, createEffect } from "effector";
import {
  createPipePromiseEffect,
  EffectParams,
  EffectResult,
} from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit, commandPipeToPromise } from "lib/run-command";
import { DiffFile, DiffChunk, DiffLine } from "lib/diff";
import {
  PATH_CACHE,
  PATH_GIT_EDITOR_MESSAGE,
  PATH_GIT_EDITOR,
} from "app/const";
import { createFileReadWriteJson } from "lib/v2/file-read-write-json";
import { createFileWatcher } from "lib/v2/file-watcher";
import { createFileConnector } from "lib/v2/file-connector";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
  diff: DiffFile | null;
};

export const cacheFile = createFileReadWriteJson<{
  coreEditor: string;
}>({ path: PATH_CACHE });
export const watcher = createFileWatcher({ path: PATH_GIT_EDITOR_MESSAGE });
export const connector = createFileConnector({
  watcher,
  id: "ustaged-connector",
});

export const discard = createPipePromiseEffect<{ paths: string[] }>(
  async ({ paths }, options) => {
    await commandPipeToPromise(
      runCommandGit(
        "stash",
        ["push", "--keep-index", "--include-untracked", "--", ...paths],
        options,
      ),
    );
    return runCommandGit("stash", ["drop"], options);
  },
);
export const stage = createPipePromiseEffect<{ paths: string[] }>(
  ({ paths }, options) => runCommandGit("add", paths, options),
);
export const diff = createEffect<EffectParams<StatusFile>, EffectResult>({
  handler: async ({ params: { path, unstage }, options }) => {
    if (unstage === "?") {
      await commandPipeToPromise(runCommandGit("add", [path], options));

      const result = await commandPipeToPromise(
        runCommandGit(
          "diff",
          ["--diff-algorithm=patience", "--cached", "--", path],
          options,
        ),
      );

      await commandPipeToPromise(
        runCommandGit("reset", ["HEAD", "--", path], options),
      );

      return result;
    }

    return await commandPipeToPromise(
      runCommandGit("diff", ["--diff-algorithm=patience", "--", path], options),
    );
  },
});
export const stageByPatch = createPipePromiseEffect(async (_, options) => {
  let cache = await cacheFile.read();

  const { value: coreEditor } = (
    await commandPipeToPromise(
      runCommandGit("config", ["core.editor"], options),
    )
  )[0];

  watcher.start();

  if (!cache.coreEditor) {
    cache.coreEditor = coreEditor;
    await cacheFile.write(cache);
  }

  await commandPipeToPromise(
    runCommandGit("config", ["core.editor", PATH_GIT_EDITOR || ""], options),
  );

  return runCommandGit("add", ["-e"], options);
});

export const discardChanges = createEvent<StatusFile>();
export const stageChanges = createEvent<StatusFile>();
export const discardAllChanges = createEvent<void>();
export const stageAllChanges = createEvent<void>();
export const getDiff = createEvent<string>();
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
export const $patchByChunk = createStore<string>("");
export const $patchByLine = createStore<string>("");
