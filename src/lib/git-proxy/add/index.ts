import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface AddParams {
  paths?: string[];
  edit?: boolean;
  intentToAdd?: boolean;
}

export const add = (params: AddParams = {}, options?: RunCommandOptions) => {
  const args = createArgs(params).filter(Boolean);

  return runCommandGit("add", args, options);
};

function createArgs(params: AddParams = {}): string[] {
  const { paths = ["-A"], edit, intentToAdd } = params;
  const N = intentToAdd ? "-N" : "";

  if (edit) {
    return ["-e", N];
  }

  return [...paths, N];
}
