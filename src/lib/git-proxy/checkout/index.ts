import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface CheckoutParams {
  target: string;
  createBranch?: boolean;
}

export const checkout = (
  params: CheckoutParams,
  options?: RunCommandOptions,
) => {
  const args = createArgs(params);

  return runCommandGit("checkout", args, options);
};

function createArgs(params: CheckoutParams): string[] {
  const { target, createBranch } = params;

  if (!target) {
    throw new Error("Error! Insert target for checkout!");
  }

  return [createBranch ? "-b" : "", target].filter(Boolean);
}
