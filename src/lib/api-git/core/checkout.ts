import { exec, execSync, BaseOptions } from "./exec";

export interface CheckoutOptions extends BaseOptions {
  branch?: string;
}

const createCommand = (options: CheckoutOptions = {}) => {
  const { branch } = options;

  return `git checkout ${branch}`;
};

export const checkout = (options: CheckoutOptions = {}): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options.execOptions);
};

export const checkoutSync = (options: CheckoutOptions = {}): string => {
  const command = createCommand(options);

  return execSync(command, options.execOptions);
};
