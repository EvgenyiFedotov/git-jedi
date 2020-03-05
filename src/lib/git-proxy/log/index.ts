import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface LogParams {
  pretty?: string;
  range?: string;
}

export const log = (params: LogParams = {}, options?: RunCommandOptions) => {
  const args = createArgs(params);

  return runCommandGit("log", args, options);
};

function createArgs(params: LogParams): string[] {
  const { pretty = "", range = "" } = params;

  return [pretty, range].filter(Boolean);
}
