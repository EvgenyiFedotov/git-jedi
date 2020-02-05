import { createStore, combine, createEvent, sample } from "effector";

import { RowContentRabaseTodo } from "./effects";
import { getFormatCommmitMessage } from "../formatted-log/handlers";
import { setIsFirstLast } from "./handlers";
import { clear } from "./events";
import { $pathFile } from "./path-file";

export interface ContentRebaseTodoFormatted {
  ref: RowContentRabaseTodo[];
}

export const $contentRebaseTodoOriginal = createStore<string>("");
export const $contentRebaseTodoFormatted = combine<
  string,
  ContentRebaseTodoFormatted
>($contentRebaseTodoOriginal, (content) => {
  const rows = content.split("\n");
  const ref = rows.filter(Boolean).map((row) => {
    const [action, shortHash, ...message] = row.split(" ");
    return {
      action,
      shortHash,
      message: getFormatCommmitMessage(message.join(" ")),
      isFirst: true,
      isLast: true,
    };
  });
  return { ref: setIsFirstLast(ref) };
});
export const $writeContentRebaseTodoParams = combine(
  $pathFile,
  $contentRebaseTodoFormatted,
  (pathFile, contentRebaseTodoFormatted) => ({
    pathFile,
    contentRebaseTodoFormatted,
  }),
);

export const changeContentRebaseTodoOriginal = createEvent<string>();
export const writeContentRebaseTodo = createEvent<void>();
export const rebaseRowMoveUp = createEvent<RowContentRabaseTodo>();
export const rebaseRowMoveDown = createEvent<RowContentRabaseTodo>();
export const changeActionRowRebaseTodo = createEvent<{
  row: RowContentRabaseTodo;
  value: RowContentRabaseTodo["action"];
}>();

$contentRebaseTodoOriginal.on(
  changeContentRebaseTodoOriginal,
  (_, content) => content,
);
$contentRebaseTodoOriginal.on(clear, () => "");

$contentRebaseTodoFormatted.on(clear, () => ({ ref: [] }));
$contentRebaseTodoFormatted.on(rebaseRowMoveUp, ({ ref }, row) => {
  const index = ref.indexOf(row);
  const nextIndex = index - 1;
  const cacheRow = ref[nextIndex];
  ref[nextIndex] = row;
  ref[index] = cacheRow;
  return { ref: setIsFirstLast(ref) };
});
$contentRebaseTodoFormatted.on(rebaseRowMoveDown, ({ ref }, row) => {
  const index = ref.indexOf(row);
  const nextIndex = index + 1;
  const cacheRow = ref[nextIndex];
  ref[nextIndex] = row;
  ref[index] = cacheRow;
  return { ref: setIsFirstLast(ref) };
});
$contentRebaseTodoFormatted.on(
  changeActionRowRebaseTodo,
  ({ ref }, { row, value }) => {
    row.action = value;
    return { ref };
  },
);
