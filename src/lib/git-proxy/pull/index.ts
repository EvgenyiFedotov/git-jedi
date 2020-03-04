import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface PullOptions extends RunCommandOptions {
  rebase?: boolean;
}

export const pull = (options: PullOptions = {}) => {
  const args = createArgs(options).filter(Boolean);

  return runCommandGit("pull", args, options);
};

function createArgs(options: PullOptions = {}) {
  const { rebase } = options;

  return [rebase ? "--rebase" : ""];
}
