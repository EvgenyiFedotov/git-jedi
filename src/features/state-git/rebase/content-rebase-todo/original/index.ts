import { createStore, createEvent, merge } from "effector";

import { abortRebase, rebaseEnd } from "../../events";
import { changeContentFile } from "../../../editor";

export const $contentRebaseTodoOriginal = createStore<string>("");

export const changeContentRebaseTodoOriginal = createEvent<string>();

// $contentRebaseTodoOriginal.on(
//   changeContentRebaseTodoOriginal,
//   (_, content) => content,
// );
$contentRebaseTodoOriginal.on(
  changeContentFile,
  (oldContent, { fileName, content }) => {
    if (fileName === "git-rebase-todo") {
      return content;
    }

    return oldContent;
  },
);
$contentRebaseTodoOriginal.on(merge([abortRebase, rebaseEnd]), () => "");
