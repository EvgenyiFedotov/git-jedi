import { execSplit } from "./exec";
import { Refs, Commit, Log } from "./types";

type CreateRefs = (refStrings: string[]) => Refs;

type CreateCommit = (commitLine: string) => Commit;

type GetCommitLines = (branch: string | [string, string]) => string[];

type Get = (branch?: string | [string, string]) => Log;

const createRefs: CreateRefs = refStrings => {
  return refStrings.reduce((memo, refString) => {
    if (refString.match(/^HEAD -> /)) {
      memo.set(refString.replace(/^HEAD -> /, ""), {
        name: refString.replace(/^HEAD -> /, ""),
        head: true,
        remote: false
      });
    } else if (refString.match(/^origin\//)) {
      memo.set(refString, {
        name: refString,
        head: false,
        remote: true
      });
    } else if (refString.match(/^tag: /)) {
      memo.set(refString.replace(/^tag: /, ""), {
        name: refString.replace(/^tag: /, "")
      });
    } else {
      memo.set(refString, { name: refString, head: false, remote: false });
    }

    return memo;
  }, new Map());
};

const createCommit: CreateCommit = commitLine => {
  const [hash, parentHash, dateTime, author, refs, ...note] = commitLine.split(
    "\n"
  );

  return {
    hash,
    parentHash,
    dateTime,
    author,
    refs: createRefs(refs.split(", ").filter(Boolean)),
    note: note.join("\n")
  };
};

const getBranchOrRange = (branch: string | [string, string] = "") => {
  return branch instanceof Array ? branch.filter(Boolean).join("..") : branch;
};

const getCommitLines: GetCommitLines = (branch = "") => {
  const branchRange = getBranchOrRange(branch);

  return execSplit(
    `git log ${branchRange} --pretty=format:"COMMIT::%n%h%n%p%n%ct%n%an%n%D%n%B" --`,
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
