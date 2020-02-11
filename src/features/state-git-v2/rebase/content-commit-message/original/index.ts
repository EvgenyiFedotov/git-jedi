import { createStore, createEvent } from "effector";

import { abortRebase } from "../../events";

export const $contentCommitMessageOriginal = createStore<string>("");

export const changeContentCommitMessageOriginal = createEvent<string>();

$contentCommitMessageOriginal.on(
  changeContentCommitMessageOriginal,
  (_, content) => content,
);
$contentCommitMessageOriginal.on(abortRebase, () => "");
