import { createEffect } from "effector";
import { writeFileSync } from "fs";
import { ipcRenderer } from "electron";
import { MessageFormatted, toMessage } from "lib/api-git-v2";

export const writeContentCommitMesssage = createEffect<
  {
    pathFile: string;
    contentCommitMessageFormatted: MessageFormatted;
  },
  void
>({
  handler: async ({ pathFile, contentCommitMessageFormatted }) => {
    const content = toMessage(contentCommitMessageFormatted);

    writeFileSync(pathFile, content);

    ipcRenderer.send("rebase-response", content);
  },
});
