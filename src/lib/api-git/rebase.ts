import { spawn, SpawnOptions, SpawnResult } from "./process";

export interface RebaseOptions extends SpawnOptions {
  target?: string;
  interactive?: boolean;
  abort?: boolean;
}

const createCommand = (options: RebaseOptions): string => {
  const { target, abort } = options;

  if (target) {
    const { interactive } = options;
    return ["git rebase", interactive && "-i", target]
      .filter(Boolean)
      .join(" ");
  } else if (abort) {
    return "git rebase --abort";
  }

  throw new Error("Error! Rebase options is not correct");
};

export interface RebaseResult extends SpawnResult {}

export const rebase = (options: RebaseOptions): RebaseResult => {
  const command = createCommand(options);
  const result = spawn(command, options);

  result.then((data, { type }) => console.log("then:", type, data));
  result.catch((data) => console.log("catch:", data));
  result.close((data) => console.log("close:", data));

  return result;
};
