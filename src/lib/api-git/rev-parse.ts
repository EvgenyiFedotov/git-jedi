import { exec, execSync, BaseOptions } from "./exec";

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

export const revParse = (options: RefParseOptions = {}): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options.execOptions);
};

export const revParseSync = (options: RefParseOptions = {}): string => {
  const command = createCommand(options);

  return execSync(command, options.execOptions);
};
