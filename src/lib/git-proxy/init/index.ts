import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface InitOptions {}

export const init = (params: InitOptions = {}, options?: RunCommandOptions) => {
  const args = createArgs(params);

  return runCommandGit("init", args, options);
};

function createArgs(params: InitOptions = {}) {
  return [];
}
