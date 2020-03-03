import { runCommandGit, RunCommandOptions } from "lib/run-command-v2";

export interface DiffOptions extends RunCommandOptions {
  commits?: string[];
  paths?: string[];
  cached?: boolean;
}

export const diff = (options: DiffOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("diff", args, options);
};

function createArgs(options: DiffOptions = {}) {
  const { commits = [], paths = [], cached = false } = options;

  return [
    "--diff-algorithm=patience",
    cached ? "--cached" : "",
    ...commits,
    "--",
    ...paths,
  ].filter(Boolean);
}
