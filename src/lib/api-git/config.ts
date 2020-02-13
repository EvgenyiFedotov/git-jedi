import { runCommandGit, RunCommandOptions } from "lib/run-command";

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

  return runCommandGit("config", args, options)
    .next(getListByOptions(options))
    .next(toLines)
    .next(toConfig);
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

function getListByOptions(options: ConfigOptions = {}) {
  const { list } = options;

  return (stdout: string) =>
    list ? stdout : runCommandGit("config", ["-l"], options);
}

function toLines(stdout: string): string[] {
  return stdout.split("\n").filter(Boolean);
}

function toConfig(lines: string[]): Config {
  return lines.reduce<Config>((memo, line) => {
    const [nameProp, value] = line.split("=");

    memo[nameProp] = value;

    return memo;
  }, {});
}
