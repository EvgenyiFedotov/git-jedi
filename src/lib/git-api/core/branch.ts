import { exetOut } from "./exec-out";

interface Branch {
  name: string;
  head: boolean;
  remote: boolean;
}

const createBranch = (line: string): Branch => {
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

export const getAll = (remote: boolean = false): Branch[] => {
  const line = exetOut(`git branch ${remote ? "-a" : ""}`);

  return line.filter(Boolean).map(createBranch);
};
