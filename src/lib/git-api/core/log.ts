import { execSplit } from "./exec";
import { Commit, Log } from "./types";

type CreateCommit = (commitLine: string) => Commit;

type GetCommitLines = (branch: string | [string, string]) => string[];

type Get = (branch?: string | [string, string]) => Log;

const createCommit: CreateCommit = commitLine => {
  const [hash, parentHash, dateTime, author, ...note] = commitLine.split("\n");

  return {
    hash,
    parentHash: parentHash.split(" "),
    dateTime,
    author,
    note: note.join("\n")
  };
};

const getBranchOrRange = (branch: string | [string, string] = "") => {
  return branch instanceof Array ? branch.filter(Boolean).join("..") : branch;
};

const getCommitLines: GetCommitLines = (branch = "") => {
  const branchRange = getBranchOrRange(branch);

  return execSplit(
    `git log ${branchRange} --pretty=format:"COMMIT::%n%H%n%P%n%ct%n%an%n%B" --`,
    "COMMIT::"
  )
    .map(value => value.replace(/^\n/, "").trim())
    .filter(Boolean);
};

export const get: Get = (branch = ""): Log => {
  const commitLines = getCommitLines(branch);

  return commitLines.reduce<Log>((memo, commitLine) => {
    const commit = createCommit(commitLine);

    memo.set(commit.hash, commit);

    return memo;
  }, new Map());
};
