import { createStore, createEvent, merge } from "effector";

import { abortRebase, rebaseEnd } from "../../events";

export const $contentRebaseTodoOriginal = createStore<string>("");

export const changeContentRebaseTodoOriginal = createEvent<string>();

$contentRebaseTodoOriginal.on(
  changeContentRebaseTodoOriginal,
  (_, content) => content,
);
$contentRebaseTodoOriginal.on(merge([abortRebase, rebaseEnd]), () => "");
