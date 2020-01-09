import { execSync } from "child_process";

export const exetOut = (command: string, split: string = "\n"): string[] => {
  return execSync(command)
    .toString()
    .split(split)
    .map(line => line.trim());
};
