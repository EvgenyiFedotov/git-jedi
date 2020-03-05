import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface StatusParams {}

export const status = (
  params: StatusParams = {},
  options?: RunCommandOptions,
) => {
  const args = createArgs(params);

  return runCommandGit("status", args, options);
};

function createArgs(params: StatusParams = {}): string[] {
  return ["-s", "--untracked-files=all"];
}
