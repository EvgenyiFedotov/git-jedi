import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface ConfigParams {
  list?: boolean;
  value?: [string] | [string, string];
}

export const config = (
  params: ConfigParams = {},
  options?: RunCommandOptions,
) => {
  const args = createArgs(params);

  return runCommandGit("config", args, options);
};

function createArgs(params: ConfigParams = {}): string[] {
  const { list, value } = params;

  if (list) {
    return ["-l"];
  } else if (value) {
    return value;
  }

  throw new Error("ConfigOptions is not correct!");
}
