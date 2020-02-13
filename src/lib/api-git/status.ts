import { runCommandGit, RunCommandOptions } from "lib/run-command";

export type StatusFile = "modified" | "untracked" | "deleted" | "added" | null;

export interface ChangeLine {
  stagedStatus: StatusFile;
  status: StatusFile;
  path: string;
}

export interface StatusOptions extends RunCommandOptions {}

export const status = (options: StatusOptions = {}) => {
  const args = createArgs(options);
  return runCommandGit("status", args, options)
    .next(toLines)
    .next(toChangeLines);
};

function createArgs(options: StatusOptions = {}): string[] {
  return ["-s"];
}

function toLines(stdout: string): string[] {
  return stdout.split("\n").filter(Boolean);
}

function toChangeLines(lines: string[]): ChangeLine[] {
  return lines.reduce<ChangeLine[]>((memo, line) => {
    const changeLine = toChangeLine(line);

    if (changeLine) {
      memo.push(changeLine);
    }

    return memo;
  }, []);
}

function toChangeLine(line: string): ChangeLine {
  const [stagedStatus, status, _, ...pathLetters] = line;
  const path = pathLetters.join("");

  return {
    stagedStatus: toStatusFile(stagedStatus),
    status: toStatusFile(status),
    path,
  };
}

function toStatusFile(value: string): StatusFile {
  switch (value) {
    case "D":
      return "deleted";
    case "M":
      return "modified";
    case "A":
      return "added";
    case "?":
      return "untracked";
  }
  return null;
}
