import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface CommitParams {
  message: string;
}

export const commit = (params: CommitParams, options?: RunCommandOptions) => {
  const args = createArgs(params);

  return runCommandGit("commit", args, options);
};

function createArgs(params: CommitParams): string[] {
  const { message } = params;
  return ["-m", message];
}
