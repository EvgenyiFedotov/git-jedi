import { runCommandGit, RunCommandOptions } from "./process";

export interface RevParseOptions extends RunCommandOptions {
  mode?: "branch" | "commitHash";
}

export const revParse = (options: RevParseOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit(args, options).next((stdout) =>
    stdout.replace("\n", "").trim(),
  );
};

function createArgs(options: RevParseOptions = {}): string[] {
  const { mode = "branch" } = options;

  switch (mode) {
    case "branch":
      return ["rev-parse", "--abbrev-ref", "HEAD"];
    case "commitHash":
      return ["rev-parse", "--verify", "HEAD"];
  }
}
