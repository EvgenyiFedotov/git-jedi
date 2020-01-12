import { log, branch, types } from "../core";

type GetBranchRefs = (log: types.Log) => types.Refs;

type GetAllRefs = (remote?: boolean) => types.Refs;

export const getBranchRefs: GetBranchRefs = log => {
  return Array.from(log.values()).reduce((memo, commit) => {
    return new Map([...memo, ...commit.refs]);
  }, new Map());
};

export const getAllRefs: GetAllRefs = () => {
  const branches = branch.getAll();

  return branches.reduce((memo, branch) => {
    const branchLog = log.get(branch.name);

    return new Map([...memo, ...getBranchRefs(branchLog)]);
  }, new Map());
};
