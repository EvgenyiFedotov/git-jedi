import { execSync } from "child_process";

let preCommand = "";
let postCommand = "";

export const setPreCommand = (value: string) => {
  preCommand = value;
};

export const setPostCommand = (value: string) => {
  postCommand = value;
};

export const exec = (command: string) => {
  const commands = [preCommand, command, postCommand].filter(Boolean);

  return execSync(commands.join(" && ")).toString();
};

export const execSplit = (command: string, split: string = "\n"): string[] => {
  return exec(command)
    .split(split)
    .map(line => line.trim());
};
