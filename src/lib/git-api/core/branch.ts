import { execSplit } from "./exec";
import { Branch } from "./types";

type CreateBranch = (line: string) => Branch;

type GetAll = (remote?: boolean) => Branch[];

const createBranch: CreateBranch = line => {
  if (line.match(/^\* /)) {
    return {
      name: line.replace(/^\* /, ""),
      head: true,
      remote: false
    };
  } else if (line.match(/^remotes\//)) {
    return {
      name: line.replace(/^remotes\//, ""),
      head: false,
      remote: true
    };
  } else {
    return {
      name: line,
      head: false,
      remote: false
    };
  }
};

export const getAll: GetAll = (remote = false) => {
  const line = execSplit(`git branch ${remote ? "-a" : ""}`);

  return line.filter(Boolean).map(createBranch);
};
