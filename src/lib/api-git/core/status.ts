import { exec, execSync, BaseOptions } from "./exec";
import { stdoutToLines } from "./common";

export interface StatusPath {
  status: "modified" | "untracked" | "deleted";
  path: string;
}

const createCommand = () => {
  return "git status -s";
};

const toStatusPath = (line: string): StatusPath | null => {
  const [status, path] = line.split(" ");

  switch (status) {
    case "D":
      return { status: "deleted", path };
    case "M":
      return { status: "modified", path };
    case "??":
      return { status: "untracked", path };
  }

  return null;
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

export const status = async (
  options: BaseOptions = {}
): Promise<StatusPath[]> => {
  const command = createCommand();

  return exec(command, options.execOptions)
    .then(stdoutToLines)
    .then(toStatus);
};

export const statusSync = (options: BaseOptions = {}): StatusPath[] => {
  const command = createCommand();
  const execResult = execSync(command, options.execOptions);
  const lines = stdoutToLines(execResult);

  return toStatus(lines);
};
