import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface StashParams {
  action?: "push" | "pop" | "drop";
  paths?: string[];
}

export const stash = (
  params: StashParams = {},
  options?: RunCommandOptions,
) => {
  const args = createArgs(params);

  return runCommandGit("stash", args, options);
};

function createArgs(params: StashParams): string[] {
  const { action = "push", paths = [] } = params;

  if (action === "drop") {
    return ["drop"];
  } else if (action === "pop") {
    return ["pop"];
  }

  return ["push", "--keep-index", "--include-untracked", "--", ...paths];
}
