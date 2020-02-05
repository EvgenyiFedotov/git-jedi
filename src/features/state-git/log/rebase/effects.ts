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
  handler: async (options) => {
    try {
      await abordingRebase({ execOptions: options.execOptions });
    } catch (e) {}
    return rebaseGit(options);
  },
});

export const writingContentRabaseTodo = createEffect<
  {
    pathFile: string;
    contentRebaseTodoFormatted: { ref: RowContentRabaseTodo[] };
  },
  void
>({
  handler: async ({ contentRebaseTodoFormatted: { ref }, pathFile }) => {
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
    contentCommitMessageFormatted: FormattedCommitMessage;
  },
  void
>({
  handler: async ({ pathFile, contentCommitMessageFormatted }) => {
    const content = formattedCommitMessageToString(
      contentCommitMessageFormatted,
    );

    writeFileSync(pathFile, content);
    ipcRenderer.send("rebase-response", content);
  },
});
