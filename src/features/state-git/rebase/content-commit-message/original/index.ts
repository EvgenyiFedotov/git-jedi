import { createStore, createEvent, merge } from "effector";

import { abortRebase, rebaseEnd } from "../../events";
import { changeContentFile } from "../../../editor";

export const $contentCommitMessageOriginal = createStore<string>("");

export const changeContentCommitMessageOriginal = createEvent<string>();

// $contentCommitMessageOriginal.on(
//   changeContentCommitMessageOriginal,
//   (_, content) => content,
// );
$contentCommitMessageOriginal.on(
  changeContentFile,
  (oldContent, { fileName, content }) => {
    if (fileName === "COMMIT_EDITMSG") {
      return content;
    }

    return oldContent;
  },
);
$contentCommitMessageOriginal.on(merge([abortRebase, rebaseEnd]), () => "");
