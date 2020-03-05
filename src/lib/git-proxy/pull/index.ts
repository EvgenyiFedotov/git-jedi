import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface PullParams {
  rebase?: boolean;
}

export const pull = (params: PullParams = {}, options?: RunCommandOptions) => {
  const args = createArgs(params).filter(Boolean);

  return runCommandGit("pull", args, options);
};

function createArgs(params: PullParams = {}) {
  const { rebase } = params;

  return [rebase ? "--rebase" : ""];
}
