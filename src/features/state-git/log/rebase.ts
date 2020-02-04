import {
  createEffect,
  createEvent,
  sample,
  createStore,
  combine,
  forward,
} from "effector";
import { ipcRenderer } from "electron";
import { readFileSync, writeFileSync } from "fs";

import {
  rebase as rebaseGit,
  RebaseOptions,
  RebaseResult,
  execSync,
  BaseOptions,
} from "lib/api-git";

import { $baseOptions } from "../config";
import {
  FormattedCommitMessage,
  getFormatCommmitMessage,
} from "./formatted-log";

const getFileContent = (pathFile: string): string => {
  return readFileSync(pathFile).toString();
};

const removeComments = (fileContent: string): string => {
  return fileContent.replace(/^\#.*$\n/gm, "").replace(/^\n+|\n+$/gm, "\n");
};

ipcRenderer.on("rebase-query", (event, args: string[]) => {
  const [, , pathFile] = args;
  const arrPath = pathFile.split("/");
  const fileName = arrPath[arrPath.length - 1];
  const content = removeComments(getFileContent(pathFile));

  switch (fileName) {
    case "git-rebase-todo":
      editRebaseTodoPrev(content);
      break;
    case "COMMIT_EDITMSG":
      editCommitEditMsgPrev(content);
      break;
  }

  // event.sender.send("rebase-response", readFileSync(pathFile).toString());
});

export const $contentRebaseTodoPrev = createStore<string>("");
export const $contentCommitEditMsgPrev = createStore<string>("");

export interface RowContentRabaseTodo {
  action: string;
  shortHash: string;
  message: FormattedCommitMessage;
  isFirst: boolean;
  isLast: boolean;
}

const setIsFirstLast = (
  rows: RowContentRabaseTodo[],
): RowContentRabaseTodo[] => {
  return rows.map((row, index) => {
    row.isFirst = index === 0;
    row.isLast = index === rows.length - 1;
    return row;
  });
};

export const $contentRebaseTodo = combine<
  string,
  { ref: RowContentRabaseTodo[] }
>($contentRebaseTodoPrev, (content) => {
  const rows = content.split("\n");
  const ref = rows.filter(Boolean).map((row) => {
    const [action, shortHash, ...message] = row.split(" ");
    return {
      action,
      shortHash,
      message: getFormatCommmitMessage(message.join(" ")),
      isFirst: true,
      isLast: true,
    };
  });
  return { ref: setIsFirstLast(ref) };
});

const editRebaseTodoPrev = createEvent<string>();
const editCommitEditMsgPrev = createEvent<string>();
export const rebaseUp = createEvent<string>();
export const abortRebase = createEvent<void>();
export const rebaseRowMoveUp = createEvent<RowContentRabaseTodo>();
export const rabaseRowMoveDown = createEvent<RowContentRabaseTodo>();

export const abordingRebase = createEffect<BaseOptions, string>({
  // TODO Changet on 'rebaseGit' with flag --abort
  handler: (options) => execSync("rm -fr .git/rebase-merge", options),
});

export const rebasing = createEffect<RebaseOptions, RebaseResult>({
  handler: (options) => {
    abordingRebase($baseOptions.getState());
    return rebaseGit(options);
  },
});

sample({
  source: $baseOptions,
  clock: rebaseUp,
  fn: (baseOptions, target) => ({ ...baseOptions, target, interactive: true }),
  target: rebasing,
});

sample({
  source: $baseOptions,
  clock: abortRebase,
  target: abordingRebase,
});

$contentRebaseTodoPrev.on(editRebaseTodoPrev, (_, content) => content);
$contentRebaseTodoPrev.on(abortRebase, () => "");

$contentCommitEditMsgPrev.on(editCommitEditMsgPrev, (_, content) => content);
$contentCommitEditMsgPrev.on(abortRebase, () => "");

$contentRebaseTodo.on(abortRebase, () => ({ ref: [] }));
$contentRebaseTodo.on(rebaseRowMoveUp, ({ ref }, row) => {
  const index = ref.indexOf(row);
  const nextIndex = index - 1;
  const cacheRow = ref[nextIndex];
  ref[nextIndex] = row;
  ref[index] = cacheRow;
  return { ref: setIsFirstLast(ref) };
});
$contentRebaseTodo.on(rabaseRowMoveDown, ({ ref }, row) => {
  const index = ref.indexOf(row);
  const nextIndex = index + 1;
  const cacheRow = ref[nextIndex];
  ref[nextIndex] = row;
  ref[index] = cacheRow;
  return { ref: setIsFirstLast(ref) };
});

// TODO abort rebase
abordingRebase($baseOptions.getState());
