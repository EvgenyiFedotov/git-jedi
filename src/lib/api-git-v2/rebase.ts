import { runCommandGit, RunCommandOptions } from "./process";

export interface RebaseOptions extends RunCommandOptions {
  target?: string;
  interactive?: boolean;
  abort?: boolean;
}

export const rebase = (options: RebaseOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit(args, options);
};

function createArgs(options: RebaseOptions = {}): string[] {
  const { target, abort } = options;

  if (target) {
    const { interactive } = options;
    return ["git rebase", interactive ? "-i" : "", target].filter(Boolean);
  } else if (abort) {
    return ["rebase", "--abort"];
  }

  throw new Error("Error! Rebase options is not correct");
}
