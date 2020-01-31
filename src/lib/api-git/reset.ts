import { exec, execSync, BaseOptions } from "./process";

export interface ResetOptions extends BaseOptions {
  intexTree?: string;
  paths?: string[];
}

const createCommand = (options: ResetOptions = {}): string => {
  const { intexTree = "HEAD", paths = [] } = options;
  return `git reset ${intexTree} -- ${paths.join(" ")}`;
};

export const reset = (options: ResetOptions = {}): Promise<string> => {
  const command = createCommand(options);
  return exec(command, options);
};

export const resetSync = (options: ResetOptions = {}): string => {
  const command = createCommand(options);
  return execSync(command, options);
};
