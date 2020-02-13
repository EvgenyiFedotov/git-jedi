import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface StashOptions extends RunCommandOptions {
  action?: "push" | "pop" | "drop";
  paths?: string[];
}

export const stash = (options: StashOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit("stash", args, options);
};

function createArgs(options: StashOptions): string[] {
  const { action = "push", paths = [] } = options;

  if (action === "drop") {
    return ["drop"];
  } else if (action === "pop") {
    return ["pop"];
  }

  return [
    "stash",
    "push",
    "--keep-index",
    "--include-untracked",
    "--",
    ...paths,
  ];
}
