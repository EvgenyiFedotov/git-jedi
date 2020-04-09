import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";
import { createCommand } from "lib/create-command";

type DiscardParams = {
  paths: string[];
};

export const discard = createCommandEffect<DiscardParams>({
  command: async ({ params: { paths }, options }) => {
    const command = createCommand(
      "git",
      ["stash", "push", "--keep-index", "--include-untracked", "--", ...paths],
      options,
    );

    await command.run().promise();

    return createCommand("git", ["stash", "drop"], options);
  },
});

export const dicardFile = ef.createEvent<string>();
export const discardAll = ef.createEvent<void>();

export const $discardingFiles = ef.createStore<{ ref: Set<string> }>({
  ref: new Set(),
});
