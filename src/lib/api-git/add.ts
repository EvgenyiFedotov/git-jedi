import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface AddOptions extends RunCommandOptions {
  paths?: string[];
}

export const add = (options: AddOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit("add", args, options);
};

function createArgs(options: AddOptions = {}): string[] {
  const { paths = [] } = options;
  if (paths.length) {
    return [...paths];
  }
  return ["-A"];
}
