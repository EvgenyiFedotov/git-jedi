import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface ResetParams {
  intexTree?: string;
  paths?: string[];
}

export const reset = (
  params: ResetParams = {},
  options?: RunCommandOptions,
) => {
  const args = createArgs(params);

  return runCommandGit("reset", args, options);
};

function createArgs(options: ResetParams = {}): string[] {
  const { intexTree = "HEAD", paths = [] } = options;

  return [intexTree, "--", ...paths];
}
