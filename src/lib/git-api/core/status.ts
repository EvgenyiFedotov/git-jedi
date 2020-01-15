import { execSplit, exec } from "./exec";

export interface StatusPath {
  status: "modified" | "untracked" | "deleted";
  path: string;
}

type ParseStatusLine = (line: string) => StatusPath | null;

const parseStatusLine: ParseStatusLine = line => {
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

type Get = () => StatusPath[];

export const get: Get = () => {
  const lines = execSplit("git status -s");

  return lines.reduce<StatusPath[]>((memo, line) => {
    const statusPath = parseStatusLine(line);

    if (statusPath) {
      memo.push(statusPath);
    }

    return memo;
  }, []);
};

export const isChanged = () => {
  return !!exec("git status -s");
};
