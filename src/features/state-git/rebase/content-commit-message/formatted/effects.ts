import { createEffect } from "effector";
import { writeFileSync } from "fs";
import { MessageFormatted, toMessage } from "lib/api-git";

import { fileConnector } from "../../connector-rebase-file";

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

    fileConnector.send(content);
  },
});
