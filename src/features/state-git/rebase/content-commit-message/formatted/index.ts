import { combine, createEvent, sample, merge } from "effector";
import { MessageFormatted } from "lib/api-git";

import { $contentCommitMessageOriginal } from "../original";
import { abortRebase, rebaseEnd } from "../../events";
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
$contentCommitMessageFormatted.on(merge([abortRebase, rebaseEnd]), () => ({
  type: "feat",
  scope: "",
  note: "",
}));
