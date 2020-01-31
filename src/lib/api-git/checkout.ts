import { exec, execSync, BaseOptions } from "./process";

export interface CheckoutOptions extends BaseOptions {
  target: string;
  createBranch?: boolean;
}

const createCommand = (options: CheckoutOptions) => {
  const { target, createBranch } = options;

  if (!target) {
    throw new Error("Error! Insert target for checkout!");
  }

  return ["git checkout", createBranch && "-b", target]
    .filter(Boolean)
    .join(" ");
};

export const checkout = (options: CheckoutOptions): Promise<string> => {
  const command = createCommand(options);

  return exec(command, options);
};

export const checkoutSync = (options: CheckoutOptions): string => {
  const command = createCommand(options);

  return execSync(command, options);
};
