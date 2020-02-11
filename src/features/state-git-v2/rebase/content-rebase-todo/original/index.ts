import { createStore, createEvent } from "effector";

import { abortRebase } from "../../events";

export const $contentRebaseTodoOriginal = createStore<string>("");

export const changeContentRebaseTodoOriginal = createEvent<string>();

$contentRebaseTodoOriginal.on(
  changeContentRebaseTodoOriginal,
  (_, content) => content,
);
$contentRebaseTodoOriginal.on(abortRebase, () => "");
