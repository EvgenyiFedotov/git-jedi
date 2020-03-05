import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface RevParseParams {
  mode?: "branch" | "commitHash";
}

export const revParse = (
  params: RevParseParams = {},
  options?: RunCommandOptions,
) => {
  const args = createArgs(params);

  return runCommandGit("rev-parse", args, options);
};

function createArgs(params: RevParseParams = {}): string[] {
  const { mode = "branch" } = params;

  switch (mode) {
    case "branch":
      return ["--abbrev-ref", "HEAD"];
    case "commitHash":
      return ["--verify", "HEAD"];
  }
}
