import { runCommandGit, RunCommandOptions } from "./run-command-git";

export interface CommitOptions extends RunCommandOptions {
  message: string;
}

export const commit = (options: CommitOptions) => {
  const args = createArgs(options);
  return runCommandGit("commit", args, options);
};

function createArgs(options: CommitOptions): string[] {
  const { message } = options;
  return ["-m", message];
}
