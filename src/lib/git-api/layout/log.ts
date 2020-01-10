import { log, branch } from "../core";

type GetBranchRefs = (log: log.Log) => log.Refs;

export const getBranchRefs: GetBranchRefs = log => {
  return Array.from(log.values()).reduce((memo, commit) => {
    return new Map([...memo, ...commit.refs]);
  }, new Map());
};

type GetAllRefs = (remote?: boolean) => log.Refs;

export const getAllRefs: GetAllRefs = (remote = false) => {
  const branches = branch.getAll(remote);

  return branches.reduce((memo, branch) => {
    const branchLog = log.get(branch.name);

    return new Map([...memo, ...getBranchRefs(branchLog)]);
  }, new Map());
};
