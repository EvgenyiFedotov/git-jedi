import { execSync } from "child_process";

export interface Commit {
  hash: string;
  parentHash: string;
  dateTime: string;
  author: string;
  refs: string[];
  note: string;
}

export type Log = Map<string, Commit>;

type CreateCommit = (commitLine: string) => Commit;

const createCommit: CreateCommit = commitLine => {
  const [hash, parentHash, dateTime, author, refs, ...note] = commitLine.split(
    "\n"
  );

  return {
    hash,
    parentHash,
    dateTime,
    author,
    refs: refs.split(", ").filter(Boolean),
    note: note.join("\n")
  };
};

const getBranchOrRange = (branch: string | [string, string] = "") => {
  return branch instanceof Array ? branch.filter(Boolean).join("..") : branch;
};

type GetCommitLines = (branch: string | [string, string]) => string[];

const getCommitLines: GetCommitLines = (branch = "") => {
  const branchRange = getBranchOrRange(branch);

  return execSync(
    `git log ${branchRange} --pretty=format:"COMMIT::%n%h%n%p%n%ct%n%an%n%D%n%B"`
  )
    .toString()
    .split("COMMIT::")
    .map(value => value.replace(/^\n/, "").trim())
    .filter(Boolean);
};

type Get = (branch?: string | [string, string]) => Log;

export const get: Get = (branch = ""): Log => {
  const commitLines = getCommitLines(branch);

  return commitLines.reduce<Log>((memo, commitLine) => {
    const commit = createCommit(commitLine);

    memo.set(commit.hash, commit);

    return memo;
  }, new Map());
};
