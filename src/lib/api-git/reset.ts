import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface ResetOptions extends RunCommandOptions {
  intexTree?: string;
  paths?: string[];
}

export const reset = (options: ResetOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit("reset", args, options);
};

function createArgs(options: ResetOptions = {}): string[] {
  const { intexTree = "HEAD", paths = [] } = options;
  return [intexTree, "--", ...paths];
}
