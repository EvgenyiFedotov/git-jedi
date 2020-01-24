import { exec, execSync, BaseOptions } from "./exec";

export interface CheckoutOptions extends BaseOptions {
  branch?: string;
  createBranch?: boolean;
}

const createCommand = (options: CheckoutOptions = {}) => {
  const { branch, createBranch } = options;

  return ["git checkout", createBranch && "-b", branch]
    .filter(Boolean)
    .join(" ");
};

export const checkout = (options: CheckoutOptions = {}): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options);
};

export const checkoutSync = (options: CheckoutOptions = {}): string => {
  const command = createCommand(options);

  return execSync(command, options);
};
