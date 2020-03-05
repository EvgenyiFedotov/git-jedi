import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface PushParams {
  setUpstream?: boolean;
  repositoryRefSpec?: string[];
  force?: boolean;
}

export const push = (params: PushParams = {}, options?: RunCommandOptions) => {
  const args = createArgs(params).filter(Boolean);

  return runCommandGit("push", args, options);
};

function createArgs(params: PushParams = {}) {
  const { setUpstream, repositoryRefSpec = [], force } = params;

  return [
    setUpstream ? "-u" : "",
    force ? "--force" : "",
    ...repositoryRefSpec,
  ];
}
