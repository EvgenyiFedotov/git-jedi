import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface AddOptions extends RunCommandOptions {
  paths?: string[];
  edit?: boolean;
  intentToAdd?: boolean;
}

export const add = (options: AddOptions = {}) => {
  const args = createArgs(options).filter(Boolean);

  return runCommandGit("add", args, options);
};

function createArgs(options: AddOptions = {}): string[] {
  const { paths = ["-A"], edit, intentToAdd } = options;
  const N = intentToAdd ? "-N" : "";

  if (edit) {
    return ["-e", N];
  }

  return [...paths, N];
}
