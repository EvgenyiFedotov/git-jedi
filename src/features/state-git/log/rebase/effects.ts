import { createEffect } from "effector";
import { writeFileSync } from "fs";
import { ipcRenderer } from "electron";

import {
  RebaseOptions,
  RebaseResult,
  BaseOptions,
  rebase as rebaseGit,
} from "lib/api-git";

import {
  FormattedCommitMessage,
  formattedCommitMessageToString,
} from "../formatted-log/handlers";

export interface RowContentRabaseTodo {
  action: string;
  shortHash: string;
  message: FormattedCommitMessage;
  isFirst: boolean;
  isLast: boolean;
}

export const abordingRebase = createEffect<BaseOptions, void>({
  handler: async (options) => {
    rebaseGit({ abort: true, ...options });
  },
});

export const rebasing = createEffect<RebaseOptions, RebaseResult>({
  handler: (options) => {
    abordingRebase({ execOptions: options.execOptions });
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

export const writingContentCommitMesssage = createEffect<
  {
    pathFile: string;
    contentCommitMessage: FormattedCommitMessage;
  },
  void
>({
  handler: async ({ pathFile, contentCommitMessage }) => {
    const content = formattedCommitMessageToString(contentCommitMessage);

    writeFileSync(pathFile, content);
    ipcRenderer.send("rebase-response", content);
  },
});
