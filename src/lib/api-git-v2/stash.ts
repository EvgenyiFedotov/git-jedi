import { runCommandGit, RunCommandOptions } from "./process";

export interface StashOptions extends RunCommandOptions {
  action?: "push" | "pop" | "drop";
  paths?: string[];
}

export const stash = (options: StashOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit(args, options);
};

function createArgs(options: StashOptions): string[] {
  const { action = "push", paths = [] } = options;

  if (action === "drop") {
    return ["stash", "drop"];
  } else if (action === "pop") {
    return ["stash", "pop"];
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
