import { createEvent, sample, createStore, combine, merge } from "effector";
import { ipcRenderer } from "electron";
import { readFileSync } from "fs";

import { $baseOptions } from "../../config";
import {
  FormattedCommitMessage,
  getFormatCommmitMessage,
} from "../formatted-log/handlers";
import {
  RowContentRabaseTodo,
  abordingRebase,
  rebasing,
  writingContentRabaseTodo,
  writingContentCommitMesssage,
} from "./effects";

const getFileContent = (pathFile: string): string => {
  return readFileSync(pathFile).toString();
};

const removeComments = (fileContent: string): string => {
  return fileContent.replace(/^\#.*$\n/gm, "").trim();
};

const getContentFile = (pathFile: string): string => {
  return removeComments(getFileContent(pathFile));
};

ipcRenderer.on("rebase-query", (event, [, , pathFile]: string[]) => {
  const arrPath = pathFile.split("/");
  const fileName = arrPath[arrPath.length - 1];
  const content = getContentFile(pathFile);

  changePath(pathFile);
  switch (fileName) {
    case "git-rebase-todo":
      changeContentRebaseTodoPrev(content);
      break;
    case "COMMIT_EDITMSG":
      changeContentCommitMessagePrev(content);
      break;
  }
});

export const $pathFile = createStore<string>("");
export const $contentRebaseTodoPrev = createStore<string>("");
export const $contentCommitEditMessagePrev = createStore<string>("");

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

const $writeContentRebaseTodoParams = combine(
  $pathFile,
  $contentRebaseTodo,
  (pathFile, contentRebaseTodo) => ({
    pathFile,
    contentRebaseTodo,
  }),
);

export const $contentCommitMessage = combine<string, FormattedCommitMessage>(
  $contentCommitEditMessagePrev,
  (content) => ({
    type: "feat",
    scope: "",
    note: content,
  }),
);

const $writeContentCommitMessageParams = combine({
  pathFile: $pathFile,
  contentCommitMessage: $contentCommitMessage,
});

const changePath = createEvent<string>();
const changeContentRebaseTodoPrev = createEvent<string>();
const changeContentCommitMessagePrev = createEvent<string>();
export const rebaseUp = createEvent<string>();
export const abortRebase = createEvent<void>();
export const rebaseRowMoveUp = createEvent<RowContentRabaseTodo>();
export const rabaseRowMoveDown = createEvent<RowContentRabaseTodo>();
export const changeActionRowRebaseTodo = createEvent<{
  row: RowContentRabaseTodo;
  value: RowContentRabaseTodo["action"];
}>();
export const writeContentRebaseTodo = createEvent<void>();
export const writeContentCommitMessage = createEvent<void>();
export const changeContentCommitMessage = createEvent<FormattedCommitMessage>();
const clear = merge([abortRebase, writingContentCommitMesssage.done]);

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

sample({
  source: $writeContentRebaseTodoParams,
  clock: writeContentRebaseTodo,
  target: writingContentRabaseTodo,
});

sample({
  source: $writeContentCommitMessageParams,
  clock: writeContentCommitMessage,
  target: writingContentCommitMesssage,
});

$pathFile.on(changePath, (_, path) => path);
$pathFile.on(clear, () => "");

$contentRebaseTodoPrev.on(changeContentRebaseTodoPrev, (_, content) => content);
$contentRebaseTodoPrev.on(clear, () => "");

$contentCommitEditMessagePrev.on(
  changeContentCommitMessagePrev,
  (_, content) => content,
);
$contentCommitEditMessagePrev.on(clear, () => "");

$contentRebaseTodo.on(clear, () => ({ ref: [] }));
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
$contentRebaseTodo.on(changeActionRowRebaseTodo, ({ ref }, { row, value }) => {
  row.action = value;
  return { ref };
});

$contentCommitMessage.on(changeContentCommitMessage, (_, value) => value);
$contentCommitMessage.on(clear, () => ({ type: "feat", scope: "", note: "" }));

// TODO abort rebase
abordingRebase($baseOptions.getState());
