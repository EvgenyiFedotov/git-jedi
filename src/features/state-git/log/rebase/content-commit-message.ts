import { createStore, combine, createEvent } from "effector";

import { FormattedCommitMessage } from "../formatted-log/handlers";
import { $pathFile } from "./path-file";
import { clear } from "./events";

export const $contentCommitMessageOriginal = createStore<string>("");
export const $contentCommitMessageFormatted = combine<
  string,
  FormattedCommitMessage
>($contentCommitMessageOriginal, (content) => ({
  type: "feat",
  scope: "",
  note: content,
}));
export const $writeContentCommitMessageParams = combine({
  pathFile: $pathFile,
  contentCommitMessageFormatted: $contentCommitMessageFormatted,
});

export const changeContentCommitMessageOriginal = createEvent<string>();
export const changeContentCommitMessageFormatted = createEvent<
  FormattedCommitMessage
>();
export const writeContentCommitMessage = createEvent<void>();

$contentCommitMessageOriginal.on(
  changeContentCommitMessageOriginal,
  (_, content) => content,
);
$contentCommitMessageOriginal.on(clear, () => "");

$contentCommitMessageFormatted.on(
  changeContentCommitMessageFormatted,
  (_, value) => value,
);
$contentCommitMessageFormatted.on(clear, () => ({
  type: "feat",
  scope: "",
  note: "",
}));
