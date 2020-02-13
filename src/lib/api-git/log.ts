import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface LogOptions extends RunCommandOptions {}
export interface Commit {
  hash: string;
  parentHash: string[];
  dateTime: string;
  author: string;
  message: string;
}

const COMMIT_BEGIN = "COMMIT::BEGIN";
const logCommitFormat = ["%H", "%P", "%ct", "%an", "%B"].join("%n");

export const log = (options: LogOptions = {}) => {
  const args = createArgs(options);
  const gitPipe = runCommandGit("log", args, options);

  return gitPipe.next(toCommitBlocks).next(toCommits);
};

function createArgs(options: LogOptions): string[] {
  const pretty = `--pretty=format:${COMMIT_BEGIN}%n${logCommitFormat}`;
  return [pretty];
}

function toCommitBlocks(stdout: string): string[] {
  return stdout
    .split(COMMIT_BEGIN)
    .map((value) => value.replace(/^\n/, ""))
    .filter(Boolean);
}

function toCommits(commitBlocks: string[]): Map<string, Commit> {
  return commitBlocks.reduce((memo, commitBlock) => {
    const commit = toCommit(commitBlock);
    memo.set(commit.hash, commit);
    return memo;
  }, new Map());
}

function toCommit(commitBlock: string): Commit {
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
