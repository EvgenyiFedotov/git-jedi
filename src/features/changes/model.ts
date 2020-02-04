import { createEvent, createStore, sample } from "effector";
import {
  createCommit as createCommitGit,
  committing,
  formattedCommitMessageToString,
  FormattedCommitMessage,
} from "features/state-git";

export const $isShowChanges = createStore<boolean>(true);
export const $commitFormValue = createStore<FormattedCommitMessage>({
  type: "feat",
  note: "",
  scope: "",
});

export const createCommit = createEvent<void>();
export const toggleIsShowChanges = createEvent<any>();
export const changeCommitFormValue = createEvent<FormattedCommitMessage>();

sample({
  source: $commitFormValue,
  clock: createCommit,
  fn: (commit) => formattedCommitMessageToString(commit),
  target: createCommitGit,
});

$isShowChanges.on(toggleIsShowChanges, (prev) => !prev);

$commitFormValue.on(committing.done, () => ({
  type: "feat",
  note: "",
  scope: "",
}));
$commitFormValue.on(changeCommitFormValue, (_, value) => value);
