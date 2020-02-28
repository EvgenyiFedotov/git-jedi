import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface PushOptions extends RunCommandOptions {
  setUpstream?: boolean;
  repositoryRefSpec?: string[];
  force?: boolean;
}

export const push = (options: PushOptions = {}) => {
  const args = createArgs(options).filter(Boolean);

  return runCommandGit("push", args, options);
};

function createArgs(options: PushOptions = {}) {
  const { setUpstream, repositoryRefSpec = [], force } = options;

  return [
    setUpstream ? "-u" : "",
    force ? "--force" : "",
    ...repositoryRefSpec,
  ];
}
