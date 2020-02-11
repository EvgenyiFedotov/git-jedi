import { combine, createEvent, sample } from "effector";
import { MessageFormatted } from "lib/api-git-v2";

import { $contentCommitMessageOriginal } from "../original";
import { abortRebase } from "../../events";
import { $pathFile } from "../../path-file";
import { writeContentCommitMesssage } from "./effects";

export const $contentCommitMessageFormatted = combine<string, MessageFormatted>(
  $contentCommitMessageOriginal,
  (content) => ({
    type: "feat",
    scope: "",
    note: content,
  }),
);

export const changeContentCommitMessageFormatted = createEvent<
  MessageFormatted
>();
export const saveContentCommitMessage = createEvent<void>();

sample({
  source: combine({
    pathFile: $pathFile,
    contentCommitMessageFormatted: $contentCommitMessageFormatted,
  }),
  clock: saveContentCommitMessage,
  target: writeContentCommitMesssage,
});

$contentCommitMessageFormatted.on(
  changeContentCommitMessageFormatted,
  (_, value) => value,
);
$contentCommitMessageFormatted.on(abortRebase, () => ({
  type: "feat",
  scope: "",
  note: "",
}));
