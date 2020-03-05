import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface DiffParams {
  commits?: string[];
  paths?: string[];
  cached?: boolean;
}

export const diff = (params: DiffParams = {}, options?: RunCommandOptions) => {
  const args = createArgs(params);

  return runCommandGit("diff", args, options);
};

function createArgs(params: DiffParams = {}) {
  const { commits = [], paths = [], cached = false } = params;

  return [
    "--diff-algorithm=patience",
    cached ? "--cached" : "",
    ...commits,
    "--",
    ...paths,
  ].filter(Boolean);
}
