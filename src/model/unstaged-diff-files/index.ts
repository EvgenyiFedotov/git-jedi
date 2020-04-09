import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";
import { createCommand } from "lib/create-command";
import { DiffFile } from "lib/diff";

import { StatusFile } from "../types";

export const unstagedDiff = createCommandEffect<StatusFile>({
  command: async ({ params, options }) => {
    const { unstage, path } = params;

    if (unstage === "?") {
      await createCommand("git", ["add", path], options).run().promise();

      const result = await createCommand(
        "git",
        ["diff", "--diff-algorithm=patience", "--cached", "--", path],
        options,
      )
        .run()
        .promise();

      await createCommand("git", ["reset", "HEAD", "--", path], options)
        .run()
        .promise();

      return result;
    }

    return createCommand(
      "git",
      ["diff", "--diff-algorithm=patience", "--", path],
      options,
    );
  },
});

export const loadUnstagedDiff = ef.createEvent<StatusFile>();

export const $unstagedDiffs = ef.createStore<{
  ref: Map<string, DiffFile>;
}>({ ref: new Map() });
