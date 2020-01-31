import { spawn, BaseOptions } from "./process";

export interface RebaseOptions extends BaseOptions {
  target: string;
  interactive?: boolean;
}

const createCommand = (options: RebaseOptions): string => {
  const { target, interactive = false } = options;

  return ["git rebase", interactive && "-i", target].filter(Boolean).join(" ");
};

export const rebase = (options: RebaseOptions): void => {
  const command = createCommand(options);
  const result = spawn(command, options);

  result.then((data) => console.log("then:", data));
  result.catch((data) => console.log("catch:", data));
};
