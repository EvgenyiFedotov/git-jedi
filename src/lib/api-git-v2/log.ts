import { runCommandGit, RunCommandOptions } from "./process";
import { createPipe } from "./pipe";

export interface LogOptions extends RunCommandOptions {}
export interface Commit {
  hash: string;
  parentHash: string[];
  dateTime: string;
  author: string;
  message: string;
}

export const COMMIT_BEGIN = "COMMIT::BEGIN";
export const logCommitFormat = ["%H", "%P", "%ct", "%an", "%B"].join("%n");

export const log = (options: LogOptions = {}) => {
  const args = createArgs(options);
  const res = runCommandGit(args, options);
  const dataPipe = createPipe<string>();

  res.data(dataPipe.resolve);

  return dataPipe.next(toCommitBlocks).next(toCommits);
};

export function createArgs(options: LogOptions): string[] {
  const pretty = `--pretty=format:${COMMIT_BEGIN}%n${logCommitFormat}`;
  return ["log", pretty];
}

export function toCommitBlocks(stdout: string): string[] {
  return stdout
    .split(COMMIT_BEGIN)
    .map((value) => value.replace(/^\n/, ""))
    .filter(Boolean);
}

export function toCommits(commitBlocks: string[]): Map<string, Commit> {
  return commitBlocks.reduce((memo, commitBlock) => {
    const commit = toCommit(commitBlock);
    memo.set(commit.hash, commit);
    return memo;
  }, new Map());
}

export function toCommit(commitBlock: string): Commit {
  const [hash, parentHash, dateTime, author, ...note] = commitBlock.split("\n");

  note.pop();

  return {
    hash,
    parentHash: parentHash.split(" "),
    dateTime,
    author,
    message: note.join("\n"),
  };
}
