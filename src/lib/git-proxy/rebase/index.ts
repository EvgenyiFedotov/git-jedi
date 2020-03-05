import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface RebaseParams {
  target?: string;
  interactive?: boolean;
  abort?: boolean;
}

export const rebase = (
  params: RebaseParams = {},
  options?: RunCommandOptions,
) => {
  const args = createArgs(params);

  return runCommandGit("rebase", args, options);
};

function createArgs(params: RebaseParams = {}): string[] {
  const { target, abort } = params;

  if (target) {
    const { interactive } = params;

    return [interactive ? "-i" : "", target].filter(Boolean);
  } else if (abort) {
    return ["--abort"];
  }

  throw new Error("Error! Rebase options is not correct");
}
