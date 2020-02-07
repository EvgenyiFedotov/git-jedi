import { runCommandGit, RunCommandOptions } from "./process";

export interface CommitOptions extends RunCommandOptions {
  message: string;
}

export const commit = (options: CommitOptions) => {
  const args = createArgs(options);
  return runCommandGit(args, options);
};

function createArgs(options: CommitOptions): string[] {
  const { message } = options;
  return ["commit", "-m", message];
}
