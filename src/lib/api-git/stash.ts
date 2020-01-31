import { exec, execSync, BaseOptions } from "./process";

export interface StashOptions extends BaseOptions {
  action?: "push" | "pop" | "drop";
  paths?: string[];
}

const createCommand = (options: StashOptions = {}): string => {
  const { action = "push", paths = [] } = options;

  if (action === "drop") {
    return "git stash drop";
  } else if (action === "pop") {
    return "git stash pop";
  }

  return `git stash push --keep-index --include-untracked -- ${paths.join(
    " ",
  )}`;
};

export const stash = (options: StashOptions = {}): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options);
};

export const stashSync = (options: StashOptions = {}): string => {
  const command = createCommand(options);

  return execSync(command, options);
};
