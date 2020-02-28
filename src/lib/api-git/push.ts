import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface PushOptions extends RunCommandOptions {
  setUpstream?: boolean;
  repositoryRefSpec?: string[];
}

export const push = (options: PushOptions = {}) => {
  const args = createArgs(options).filter(Boolean);

  return runCommandGit("push", args, options);
};

function createArgs(options: PushOptions = {}) {
  const { setUpstream, repositoryRefSpec = [] } = options;

  return [setUpstream ? "-u" : "", ...repositoryRefSpec];
}
