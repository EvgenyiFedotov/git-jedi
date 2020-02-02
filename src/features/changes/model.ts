import { createEvent, createStore, sample } from "effector";
import {
  createCommit as createCommitGit,
  committing,
} from "features/state-git";
import { CommitFormValue } from "features/commit-form";

export const $isShowChanges = createStore<boolean>(true);
export const $commitFormValue = createStore<CommitFormValue>({
  type: "feat",
  note: "",
});

export const createCommit = createEvent<void>();
export const toggleIsShowChanges = createEvent<any>();
export const changeCommitFormValue = createEvent<CommitFormValue>();

sample({
  source: $commitFormValue,
  clock: createCommit,
  fn: ({ type, note }) => `${type}: ${note}`,
  target: createCommitGit,
});

$isShowChanges.on(toggleIsShowChanges, (prev) => !prev);

$commitFormValue.on(committing.done, () => ({ type: "feat", note: "" }));
$commitFormValue.on(changeCommitFormValue, (_, value) => value);
