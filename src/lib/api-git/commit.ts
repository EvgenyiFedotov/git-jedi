import { exec, execSync, BaseOptions } from "./process";

export interface CommitOptions extends BaseOptions {
  message: string;
}

const createCommand = (options: CommitOptions): string => {
  const { message } = options;

  if (!message) {
    throw new Error("Insert message commit");
  }

  return `git commit -m "${message}"`;
};

export const commit = async (options: CommitOptions): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options);
};

export const commitSync = (options: CommitOptions): string => {
  const command = createCommand(options);

  return execSync(command, options);
};
