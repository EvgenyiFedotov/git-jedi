import { exec, execSync, BaseOptions } from "./exec";

export type StatusFile = "modified" | "untracked" | "deleted" | "added" | null;

export interface StatusPath {
  stagedStatus: StatusFile;
  status: StatusFile;
  path: string;
}

const createCommand = () => {
  return "git status -s";
};

const toStatusFile = (value: string): StatusFile => {
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
};

const toStatusPath = (line: string): StatusPath | null => {
  const [stagedStatus, status, _, ...pathLetters] = line;
  const path = pathLetters.join("");

  return {
    stagedStatus: toStatusFile(stagedStatus),
    status: toStatusFile(status),
    path
  };
};

const toStatus = (lines: string[]): StatusPath[] => {
  return lines.reduce<StatusPath[]>((memo, line) => {
    const statusPath = toStatusPath(line);

    if (statusPath) {
      memo.push(statusPath);
    }

    return memo;
  }, []);
};

const toLines = (stdout: string): string[] => {
  return stdout.split("\n").filter(Boolean);
};

export const status = async (
  options: BaseOptions = {}
): Promise<StatusPath[]> => {
  const command = createCommand();

  return exec(command, options.execOptions)
    .then(toLines)
    .then(toStatus);
};

export const statusSync = (options: BaseOptions = {}): StatusPath[] => {
  const command = createCommand();
  const execResult = execSync(command, options.execOptions);
  const lines = toLines(execResult);

  return toStatus(lines);
};
