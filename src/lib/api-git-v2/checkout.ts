import { runCommandGit, RunCommandOptions } from "./process";

export interface CheckoutOptions extends RunCommandOptions {
  target: string;
  createBranch?: boolean;
}

export const checkout = (options: CheckoutOptions) => {
  const args = createArgs(options);
  return runCommandGit(args, options);
};

function createArgs(options: CheckoutOptions): string[] {
  const { target, createBranch } = options;

  if (!target) {
    throw new Error("Error! Insert target for checkout!");
  }

  return ["checkout", createBranch ? "-b" : "", target].filter(Boolean);
}
