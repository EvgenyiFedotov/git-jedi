import { createEvent, createStore, sample } from "effector";
// import {
//   commit,
//   formattedCommitMessageToString,
//   FormattedCommitMessage,
// } from "features/state-git-v2";
import { createCommit as createCommitGitV2 } from "features/state-git-v2";
import { MessageFormatted, toMessage } from "lib/api-git-v2";

export const $isShowChanges = createStore<boolean>(true);
export const $commitFormValue = createStore<MessageFormatted>({
  type: "feat",
  note: "",
  scope: "",
});

export const createCommit = createEvent<void>();
export const toggleIsShowChanges = createEvent<any>();
export const changeCommitFormValue = createEvent<MessageFormatted>();

sample({
  source: $commitFormValue,
  clock: createCommit,
  fn: (commit) => toMessage(commit),
  target: createCommitGitV2,
});

// sample({
//   source: $commitFormValue,
//   clock: createCommit,
//   fn: (commit) => formattedCommitMessageToString(commit),
//   target: createCommitGit,
// });

$isShowChanges.on(toggleIsShowChanges, (prev) => !prev);

// $commitFormValue.on(commit.done, () => ({
//   type: "feat",
//   note: "",
//   scope: "",
// }));
$commitFormValue.on(changeCommitFormValue, (_, value) => value);
