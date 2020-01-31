import { exec, execSync, BaseOptions } from "./process";

export interface RefParseOptions extends BaseOptions {
  mode?: "branch" | "commitHash";
}

const createCommand = (options: RefParseOptions = {}): string => {
  const { mode = "branch" } = options;

  switch (mode) {
    case "branch":
      return "git rev-parse --abbrev-ref HEAD";
    case "commitHash":
      return "git rev-parse --verify HEAD";
  }
};

const toResult = (stdout: string): string => {
  return stdout.replace("\n", "").trim();
};

export const revParse = (options: RefParseOptions = {}): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options).then(toResult);
};

export const revParseSync = (options: RefParseOptions = {}): string => {
  const command = createCommand(options);
  const stdout = execSync(command, options);

  return toResult(stdout);
};
