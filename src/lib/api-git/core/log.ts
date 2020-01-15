import { exec, BaseOptions } from "./exec";

export interface Commit {
  hash: string;
  parentHash: string[];
  dateTime: string;
  author: string;
  note: string;
}

export type Log = Map<string, Commit>;

const flagCommitBegin = "COMMIT::BEGIN";
const commitFormat = ["%H", "%P", "%ct", "%an", "%B"].join("%n");

const stdoutToCommitLines = (stdout: string): string[] => {
  return stdout
    .split(flagCommitBegin)
    .map(value => value.replace(/^\n/, ""))
    .filter(Boolean);
};

const lineToCommit = (line: string): Commit => {
  console.log(line);
  const [hash, parentHash, dateTime, author, ...note] = line.split("\n");

  return {
    hash,
    parentHash: parentHash.split(" "),
    dateTime,
    author,
    note: note.join("\n")
  };
};

const commitLinesToLog = (lines: string[]): Log => {
  return lines.reduce((memo, line) => {
    const commit = lineToCommit(line);
    memo.set(commit.hash, commit);
    return memo;
  }, new Map());
};

const createCommand = () => {
  const pretty = `--pretty=format:"${flagCommitBegin}%n${commitFormat}"`;
  return `git log ${pretty} --`;
};

const parseLog = async (execResult: Promise<string>): Promise<Log> => {
  return execResult.then(stdoutToCommitLines).then(commitLinesToLog);
};

export const log = async (options: BaseOptions = {}) => {
  const command = createCommand();
  const execResult = exec(command, options.execOptions);
  return parseLog(execResult);
};
