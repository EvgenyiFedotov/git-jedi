import { createStore, split, combine } from "effector";
import {
  $contentRebaseTodoFormatted,
  $contentCommitMessageOriginal,
} from "features/state-git";

type Tab = "log" | "edit-rebase-todo" | "edit-commit-message";

export const $tab = createStore<Tab>("log");

const changeTab = split(
  combine({
    contentRebaseTodoFormatted: $contentRebaseTodoFormatted,
    contentCommitMessageOriginal: $contentCommitMessageOriginal,
  }),
  {
    log: ({ contentRebaseTodoFormatted }) =>
      !contentRebaseTodoFormatted.ref.length,
    editRebaseTodo: ({
      contentRebaseTodoFormatted,
      contentCommitMessageOriginal,
    }) =>
      !!contentRebaseTodoFormatted.ref.length && !contentCommitMessageOriginal,
    editCommitMessage: ({
      contentRebaseTodoFormatted,
      contentCommitMessageOriginal,
    }) =>
      !!contentRebaseTodoFormatted.ref.length && !!contentCommitMessageOriginal,
  },
);

$tab.on(changeTab.log, () => "log");
$tab.on(changeTab.editRebaseTodo, () => "edit-rebase-todo");
$tab.on(changeTab.editCommitMessage, () => "edit-commit-message");
