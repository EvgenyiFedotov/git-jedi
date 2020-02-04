import { createStore, split, combine } from "effector";
import {
  $contentRebaseTodo,
  $contentCommitEditMessagePrev,
} from "features/state-git";

type Tab = "log" | "edit-rebase-todo" | "edit-commit-message";

export const $tab = createStore<Tab>("log");

const changeTab = split(
  combine({
    contentRebaseTodo: $contentRebaseTodo,
    contentCommitEditMessagePrev: $contentCommitEditMessagePrev,
  }),
  {
    log: ({ contentRebaseTodo }) => !contentRebaseTodo.ref.length,
    editRebaseTodo: ({ contentRebaseTodo, contentCommitEditMessagePrev }) =>
      !!contentRebaseTodo.ref.length && !contentCommitEditMessagePrev,
    editCommitMessage: ({ contentRebaseTodo, contentCommitEditMessagePrev }) =>
      !!contentRebaseTodo.ref.length && !!contentCommitEditMessagePrev,
  },
);

$tab.on(changeTab.log, () => "log");
$tab.on(changeTab.editRebaseTodo, () => "edit-rebase-todo");
$tab.on(changeTab.editCommitMessage, () => "edit-commit-message");
