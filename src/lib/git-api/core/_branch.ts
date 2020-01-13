import { execSplit } from "./exec";
import { Branch } from "./types";

type CreateBranch = (line: string) => Branch | null;

type GetAll = (remote?: boolean) => Branch[];

const createBranch: CreateBranch = line => {
  if (line.match(/^\* \(HEAD/)) {
    return null;
  }

  if (line.match(/^\* /)) {
    return {
      name: line.replace(/^\* /, ""),
      head: false,
      remote: false,
      current: true
    };
  } else if (line.match(/^remotes\//)) {
    if (line.match(/^remotes\/origin\/HEAD -> /)) {
      return {
        name: line.replace(/^remotes\/origin\/HEAD -> /, ""),
        head: true,
        remote: true,
        current: false
      };
    }

    return {
      name: line.replace(/^remotes\//, ""),
      head: false,
      remote: true,
      current: false
    };
  }

  return {
    name: line,
    head: false,
    remote: false,
    current: false
  };
};

export const getAll: GetAll = (remote = false) => {
  const lines = execSplit(`git branch ${remote ? "-a" : ""}`);

  return lines.filter(Boolean).reduce<Branch[]>((memo, line) => {
    const branch = createBranch(line);

    if (branch) {
      memo.push(branch);
    }

    return memo;
  }, []);
};
