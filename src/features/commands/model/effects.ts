import { createEffect } from "effector";

import { Command } from "./stores";

export const runCommand = createEffect<Command, void>().use((command) => {
  command.run();
});
