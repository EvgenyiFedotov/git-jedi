import { execSync } from "child_process";

export interface Ref {
  type: "origin" | "tag" | "head" | null;
  name: string;
  value: string;
}

export type Refs = Map<string, Ref>;

export interface Commit {
  hash: string;
  parentHash: string;
  dateTime: string;
  author: string;
  refs: Refs;
  note: string;
}

export type Log = Map<string, Commit>;

type CreateRefs = (refStrings: string[]) => Refs;

const createRefs: CreateRefs = refStrings => {
  return refStrings.reduce((memo, refString) => {
    if (refString.match(/^HEAD -> /)) {
      memo.set(refString, {
        type: "head",
        name: refString.replace(/^HEAD -> /, ""),
        value: refString
      });
    } else if (refString.match(/^origin\//)) {
      memo.set(refString, {
        type: "origin",
        name: refString.replace(/^origin\//, ""),
        value: refString
      });
    } else if (refString.match(/^tag: /)) {
      memo.set(refString, {
        type: "head",
        name: refString.replace(/^tag: /, ""),
        value: refString
      });
    } else {
      memo.set(refString, { type: null, name: refString, value: refString });
    }

    return memo;
  }, new Map());
};

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
    refs: createRefs(refs.split(", ").filter(Boolean)),
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
