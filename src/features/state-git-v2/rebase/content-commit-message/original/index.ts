import { createStore, createEvent, merge } from "effector";

import { abortRebase, rebaseEnd } from "../../events";

export const $contentCommitMessageOriginal = createStore<string>("");

export const changeContentCommitMessageOriginal = createEvent<string>();

$contentCommitMessageOriginal.on(
  changeContentCommitMessageOriginal,
  (_, content) => content,
);
$contentCommitMessageOriginal.on(merge([abortRebase, rebaseEnd]), () => "");
