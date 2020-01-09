import { exetOut } from "./exec-out";

interface Branch {
  name: string;
  current: boolean;
}

const createBranch = (line: string): Branch => {
  if (line.match(/^\* /)) {
    return { name: line.replace(/^\* /, ""), current: true };
  }

  return { name: line, current: false };
};

export const getLocal = (origin: boolean = false): Branch[] => {
  const line = exetOut(`git branch -a -l | grep -v /origin/`);

  return line.filter(Boolean).map(createBranch);
};

export const getOrigin = (): Branch[] => {
  const line = exetOut(`git branch -a -l | grep /origin/`);

  return line.filter(Boolean).map(createBranch);
};
