import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface LogOptions extends RunCommandOptions {
  pretty?: string;
  range?: string;
}

export const log = (options: LogOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("log", args, options);
};

function createArgs(options: LogOptions): string[] {
  const { pretty = "", range = "" } = options;

  return [pretty, range].filter(Boolean);
}
