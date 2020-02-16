import { createEffect } from "effector";
import { MessageFormatted, toMessage } from "lib/api-git";
import { writeFileSync } from "fs";

import { fileConnector } from "../../connector-rebase-file";

export interface RowContentRabaseTodo {
  action: string;
  shortHash: string;
  message: MessageFormatted;
  isFirst: boolean;
  isLast: boolean;
}

export const writeContentRabaseTodo = createEffect<
  {
    pathFile: string;
    contentRebaseTodoFormatted: { ref: RowContentRabaseTodo[] };
  },
  void
>({
  handler: async ({ contentRebaseTodoFormatted: { ref }, pathFile }) => {
    const content = ref
      .reduce<string[]>((memo, row) => {
        const message = toMessage(row.message);

        memo.push(`${row.action} ${row.shortHash} ${message}`);

        return memo;
      }, [])
      .join("\n");

    writeFileSync(pathFile, content);

    fileConnector.send(content);
  },
});
