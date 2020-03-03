import { runCommandGit, RunCommandOptions } from "lib/run-command-v2";

export interface ShowRefOptions extends RunCommandOptions {}

export const showRef = (options: RunCommandOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("show-ref", args, options);
};

function createArgs(options: RunCommandOptions = {}): string[] {
  return ["--head", "--dereference"];
}
