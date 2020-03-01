import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface RebaseOptions extends RunCommandOptions {
  target?: string;
  interactive?: boolean;
  abort?: boolean;
}

export const rebase = (options: RebaseOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit("rebase", args, options);
};

function createArgs(options: RebaseOptions = {}): string[] {
  const { target, abort } = options;

  if (target) {
    const { interactive } = options;
    return [interactive ? "-i" : "", target].filter(Boolean);
  } else if (abort) {
    return ["--abort"];
  }

  throw new Error("Error! Rebase options is not correct");
}
