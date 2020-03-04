import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface FetchOptions extends RunCommandOptions {
  prune?: boolean;
}

export const fetch = (options: FetchOptions = {}) => {
  const args = createArgs(options).filter(Boolean);

  return runCommandGit("fetch", args, options);
};

function createArgs(options: FetchOptions = {}) {
  const { prune } = options;

  return [prune ? "-p" : ""];
}
