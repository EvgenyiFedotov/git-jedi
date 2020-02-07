import { runCommandGit, RunCommandOptions } from "./process";

export interface AddOptions extends RunCommandOptions {
  paths?: string[];
}

export const add = (options: AddOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit(args, options);
};

function createArgs(options: AddOptions = {}): string[] {
  const { paths = [] } = options;
  if (paths.length) {
    return ["add", ...paths];
  }
  return ["add", "-A"];
}
