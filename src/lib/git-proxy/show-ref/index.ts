import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface ShowRefParams {}

export const showRef = (
  params: ShowRefParams = {},
  options: RunCommandOptions = {},
) => {
  const args = createArgs(params);

  return runCommandGit("show-ref", args, options);
};

function createArgs(params: RunCommandOptions = {}): string[] {
  return ["--head", "--dereference"];
}
