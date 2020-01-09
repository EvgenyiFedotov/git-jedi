import * as core from "../core";

interface LogTree extends core.log.Log {
  branches: string[];
}

const logsToLogsTree = (
  logs: Map<string, core.log.Log>
): Map<string, LogTree> => {
  return Array.from(logs.values()).reduce<Map<string, LogTree>>((memo, log) => {
    memo.set(log.commit, { ...log, branches: [] });

    return memo;
  }, new Map());
};

export const get = (branchName: string = "master"): Map<string, LogTree> => {
  const masterLog = core.log.get(branchName);
  const commits = logsToLogsTree(masterLog);

  core.branch.getLocal().forEach(branch => {
    if (branch.name !== branchName) {
      const log = core.log.get([
        core.log.getParentLabel(branch.name)?.name || "",
        branch.name
      ]);
      const lastLog = Array.from(log.values())[log.size - 1];
      const commit = commits.get(lastLog.parentCommit);

      if (commit) {
        commit.branches.push(branch.name);
      }
    }
  });

  return commits;
};