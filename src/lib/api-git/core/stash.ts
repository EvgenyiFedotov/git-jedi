import { exec, execSync, BaseOptions } from "./exec";

export interface StashOptions extends BaseOptions {
  paths?: string[];
}

const createCommand = (options: StashOptions = {}): string => {
  const { paths = [] } = options;

  return `git stash push --keep-index --include-untracked -- ${paths.join(
    " "
  )}`;
};

export const stash = (options: StashOptions = {}): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options.execOptions);
};

export const stashSync = (options: StashOptions = {}): string => {
  const command = createCommand(options);

  return execSync(command, options.execOptions);
};
