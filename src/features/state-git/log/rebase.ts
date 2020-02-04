import {
  createEffect,
  createEvent,
  sample,
  createStore,
  combine,
  split,
} from "effector";
import { ipcRenderer } from "electron";
import { readFileSync, writeFileSync } from "fs";

import {
  rebase as rebaseGit,
  RebaseOptions,
  RebaseResult,
  execSync,
  BaseOptions,
} from "lib/api-git";

import { $baseOptions } from "../config";
import {
  FormattedCommitMessage,
  getFormatCommmitMessage,
  formattedCommitMessageToString,
} from "./formatted-log";

const getFileContent = (pathFile: string): string => {
  return readFileSync(pathFile).toString();
};

const removeComments = (fileContent: string): string => {
  return fileContent.replace(/^\#.*$\n/gm, "").replace(/^\n+|\n+$/gm, "\n");
};

const getContentFile = (pathFile: string): string => {
  return removeComments(getFileContent(pathFile));
};

ipcRenderer.on("rebase-query", (event, [, , pathFile]: string[]) => {
  changePath(pathFile);
});

export const $pathFile = createStore<string>("");
export const $contentRebaseTodoPrev = createStore<string>("");
export const $contentCommitEditMsgPrev = createStore<string>("");

const isNeedFile = (nameFile: string) => (path: string): boolean => {
  const arrPath = path.split("/");
  return arrPath[arrPath.length - 1] === nameFile;
};

const contentByPath = split($pathFile, {
  todo: isNeedFile("git-rebase-todo"),
  commitMsg: isNeedFile("COMMIT_EDITMSG"),
});

export interface RowContentRabaseTodo {
  action: string;
  shortHash: string;
  message: FormattedCommitMessage;
  isFirst: boolean;
  isLast: boolean;
}

const setIsFirstLast = (
  rows: RowContentRabaseTodo[],
): RowContentRabaseTodo[] => {
  return rows.map((row, index) => {
    row.isFirst = index === 0;
    row.isLast = index === rows.length - 1;
    return row;
  });
};

export const $contentRebaseTodo = combine<
  string,
  { ref: RowContentRabaseTodo[] }
>($contentRebaseTodoPrev, (content) => {
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

const $writeContentRebaseTodoParams = combine(
  $pathFile,
  $contentRebaseTodo,
  (pathFile, contentRebaseTodo) => ({
    pathFile,
    contentRebaseTodo,
  }),
);

const changePath = createEvent<string>();
export const rebaseUp = createEvent<string>();
export const abortRebase = createEvent<void>();
export const rebaseRowMoveUp = createEvent<RowContentRabaseTodo>();
export const rabaseRowMoveDown = createEvent<RowContentRabaseTodo>();
export const changeActionRowRebaseTodo = createEvent<{
  row: RowContentRabaseTodo;
  value: RowContentRabaseTodo["action"];
}>();
export const writeContentRebaseTodo = createEvent<void>();

export const abordingRebase = createEffect<BaseOptions, void>({
  handler: async (options) => {
    rebaseGit({ abort: true, ...options });
  },
});

export const rebasing = createEffect<RebaseOptions, RebaseResult>({
  handler: (options) => {
    abordingRebase($baseOptions.getState());
    return rebaseGit(options);
  },
});

export const writingContentRabaseTodo = createEffect<
  {
    pathFile: string;
    contentRebaseTodo: { ref: RowContentRabaseTodo[] };
  },
  void
>({
  handler: async ({ contentRebaseTodo: { ref }, pathFile }) => {
    const content = ref
      .reduce<string[]>((memo, row) => {
        const message = formattedCommitMessageToString(row.message);
        memo.push(`${row.action} ${row.shortHash} ${message}`);
        return memo;
      }, [])
      .join("\n");

    writeFileSync(pathFile, content);

    ipcRenderer.send("rebase-response", content);
  },
});

sample({
  source: $baseOptions,
  clock: rebaseUp,
  fn: (baseOptions, target) => ({ ...baseOptions, target, interactive: true }),
  target: rebasing,
});

sample({
  source: $baseOptions,
  clock: abortRebase,
  target: abordingRebase,
});

sample({
  source: $writeContentRebaseTodoParams,
  clock: writeContentRebaseTodo,
  target: writingContentRabaseTodo,
});

$contentCommitEditMsgPrev.watch(console.log);

$pathFile.on(changePath, (_, path) => path);
$pathFile.on(abortRebase, () => "");

$contentRebaseTodoPrev.on(contentByPath.todo, (_, pathFile) =>
  getContentFile(pathFile),
);
$contentRebaseTodoPrev.on(abortRebase, () => "");

$contentCommitEditMsgPrev.on(contentByPath.commitMsg, (_, pathFile) =>
  getContentFile(pathFile),
);
$contentCommitEditMsgPrev.on(abortRebase, () => "");

$contentRebaseTodo.on(abortRebase, () => ({ ref: [] }));
$contentRebaseTodo.on(rebaseRowMoveUp, ({ ref }, row) => {
  const index = ref.indexOf(row);
  const nextIndex = index - 1;
  const cacheRow = ref[nextIndex];
  ref[nextIndex] = row;
  ref[index] = cacheRow;
  return { ref: setIsFirstLast(ref) };
});
$contentRebaseTodo.on(rabaseRowMoveDown, ({ ref }, row) => {
  const index = ref.indexOf(row);
  const nextIndex = index + 1;
  const cacheRow = ref[nextIndex];
  ref[nextIndex] = row;
  ref[index] = cacheRow;
  return { ref: setIsFirstLast(ref) };
});
$contentRebaseTodo.on(changeActionRowRebaseTodo, ({ ref }, { row, value }) => {
  row.action = value;
  return { ref };
});

// TODO abort rebase
abordingRebase($baseOptions.getState());
