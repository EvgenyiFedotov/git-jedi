import { createEvent, createStore, sample } from "effector";
import { createCommit as createCommitGitV2, commit } from "features/state-git";
import { MessageFormatted, toMessage } from "lib/api-git";

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

$isShowChanges.on(toggleIsShowChanges, (prev) => !prev);

$commitFormValue.on(changeCommitFormValue, (_, value) => value);
$commitFormValue.on(commit.done, () => ({
  type: "feat",
  note: "",
  scope: "",
}));
