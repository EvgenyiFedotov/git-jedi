import { runCommandGit, RunCommandOptions } from "lib/run-command-v2";

export interface ConfigOptions extends RunCommandOptions {
  list?: boolean;
  value?: [string] | [string, string];
}

export interface Config {
  "core.editor"?: string;
  [nameProp: string]: string | undefined;
}

export const config = (options: ConfigOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("config", args, options);
};

function createArgs(options: ConfigOptions = {}): string[] {
  const { list, value } = options;

  if (list) {
    return ["-l"];
  } else if (value) {
    return value;
  }

  throw new Error("ConfigOptions is not correct!");
}
