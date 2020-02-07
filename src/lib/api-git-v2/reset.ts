import { runCommandGit, RunCommandOptions } from "./process";

export interface ResetOptions extends RunCommandOptions {
  intexTree?: string;
  paths?: string[];
}

export const reset = (options: ResetOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit(args, options);
};

function createArgs(options: ResetOptions = {}): string[] {
  const { intexTree = "HEAD", paths = [] } = options;
  return ["reset", intexTree, "--", ...paths];
}
