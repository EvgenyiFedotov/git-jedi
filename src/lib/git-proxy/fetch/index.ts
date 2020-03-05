import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface FetchParams {
  prune?: boolean;
}

export const fetch = (
  params: FetchParams = {},
  options?: RunCommandOptions,
) => {
  const args = createArgs(params).filter(Boolean);

  return runCommandGit("fetch", args, options);
};

function createArgs(params: FetchParams = {}) {
  const { prune } = params;

  return [prune ? "-p" : ""];
}
