import { spawn, SpawnOptions, SpawnResult } from "./process";

export interface RebaseOptions extends SpawnOptions {
  target: string;
  interactive?: boolean;
}

export interface RebaseResult extends SpawnResult {}

const createCommand = (options: RebaseOptions): string => {
  const { target, interactive = false } = options;

  return ["git rebase", interactive && "-i", target].filter(Boolean).join(" ");
};

export const rebase = (options: RebaseOptions): RebaseResult => {
  const command = createCommand(options);
  const result = spawn(command, options);

  result.then((data, { type }) => console.log("then:", type, data));
  result.catch((data) => console.log("catch:", data));
  result.close((data) => console.log("close:", data));

  return result;
};
