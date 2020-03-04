import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface StatusOptions extends RunCommandOptions {}

export const status = (options: StatusOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("status", args, options);
};

function createArgs(options: StatusOptions = {}): string[] {
  return ["-s", "--untracked-files=all"];
}
