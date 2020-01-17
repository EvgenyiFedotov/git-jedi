import { exec, execSync, BaseOptions } from "./exec";

export interface AddOptions extends BaseOptions {
  paths?: string[];
}

const createCommand = (options: AddOptions = {}): string => {
  const { paths = [] } = options;

  if (paths.length) {
    return `git add ${paths.join(" ")}`;
  }

  return "git add -A";
};

export const add = (options: AddOptions = {}): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options.execOptions);
};

export const addSync = (options: AddOptions = {}): string => {
  const command = createCommand(options);

  return execSync(command, options.execOptions);
};
