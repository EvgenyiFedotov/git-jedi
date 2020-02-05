import { sample } from "effector";
import { ipcRenderer } from "electron";

import {
  $writeContentRebaseTodoParams,
  writeContentRebaseTodo,
  changeContentRebaseTodoOriginal,
} from "./content-rebase-todo";
import {
  writingContentRabaseTodo,
  rebasing,
  abordingRebase,
  writingContentCommitMesssage,
} from "./effects";
import { $baseOptions } from "../../config";
import { rebaseUp, abortRebase } from "./events";
import {
  $writeContentCommitMessageParams,
  writeContentCommitMessage,
  changeContentCommitMessageOriginal,
} from "./content-commit-message";
import { getContentFile } from "./handlers";
import { changePath } from "./path-file";

export {
  $contentRebaseTodoOriginal,
  $contentRebaseTodoFormatted,
  rebaseRowMoveUp,
  rebaseRowMoveDown,
  changeActionRowRebaseTodo,
  writeContentRebaseTodo,
} from "./content-rebase-todo";
export {
  $contentCommitMessageOriginal,
  $contentCommitMessageFormatted,
  writeContentCommitMessage,
  changeContentCommitMessageFormatted,
} from "./content-commit-message";
export { RowContentRabaseTodo } from "./effects";
export { abortRebase, rebaseUp } from "./events";

ipcRenderer.on("rebase-query", (event, [, , pathFile]: string[]) => {
  const arrPath = pathFile.split("/");
  const fileName = arrPath[arrPath.length - 1];
  const content = getContentFile(pathFile);

  changePath(pathFile);

  switch (fileName) {
    case "git-rebase-todo":
      changeContentRebaseTodoOriginal(content);
      break;
    case "COMMIT_EDITMSG":
      changeContentCommitMessageOriginal(content);
      break;
  }
});

sample({
  source: $writeContentRebaseTodoParams,
  clock: writeContentRebaseTodo,
  target: writingContentRabaseTodo,
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

sample({
  source: $writeContentCommitMessageParams,
  clock: writeContentCommitMessage,
  target: writingContentCommitMesssage,
});

// TODO abort rebase
abordingRebase($baseOptions.getState());
