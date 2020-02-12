import { combine, createEvent, sample, merge } from "effector";
import { toMessageFormatted } from "lib/api-git-v2";

import { $contentRebaseTodoOriginal } from "../original";
import { abortRebase, rebaseEnd } from "../../events";
import { $pathFile } from "../../path-file";
import { RowContentRabaseTodo, writeContentRabaseTodo } from "./effects";

export { RowContentRabaseTodo } from "./effects";

export const $contentRebaseTodoFormatted = combine<
  string,
  { ref: RowContentRabaseTodo[] }
>($contentRebaseTodoOriginal, (content) => {
  const rows = content.split("\n");
  const ref = rows.filter(Boolean).map((row) => {
    const [action, shortHash, ...message] = row.split(" ");

    return {
      action,
      shortHash,
      message: toMessageFormatted(message.join(" ")),
      isFirst: true,
      isLast: true,
    };
  });

  return { ref: setIsFirstLast(ref) };
});

export const rebaseRowMoveUp = createEvent<RowContentRabaseTodo>();
export const rebaseRowMoveDown = createEvent<RowContentRabaseTodo>();
export const changeActionRowRebaseTodoFormatted = createEvent<{
  row: RowContentRabaseTodo;
  value: RowContentRabaseTodo["action"];
}>();
export const saveContentRebaseTodo = createEvent<void>();

sample({
  source: combine({
    pathFile: $pathFile,
    contentRebaseTodoFormatted: $contentRebaseTodoFormatted,
  }),
  clock: saveContentRebaseTodo,
  target: writeContentRabaseTodo,
});

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
  changeActionRowRebaseTodoFormatted,
  ({ ref }, { row, value }) => {
    row.action = value;

    return { ref };
  },
);
$contentRebaseTodoFormatted.on(merge([abortRebase, rebaseEnd]), () => ({
  ref: [],
}));

function setIsFirstLast(rows: RowContentRabaseTodo[]): RowContentRabaseTodo[] {
  return rows.map((row, index) => {
    row.isFirst = index === 0;
    row.isLast = index === rows.length - 1;
    return row;
  });
}
