import { exec, execSync, BaseOptions } from "./process";
import { log as logV2 } from "../api-git-v2";

export interface Commit {
  hash: string;
  parentHash: string[];
  dateTime: string;
  author: string;
  message: string;
}

export type Log = Map<string, Commit>;

export interface LogOptions extends BaseOptions {
  all?: boolean;
}

const flagCommitBegin = "COMMIT::BEGIN";
const commitFormat = ["%H", "%P", "%ct", "%an", "%B"].join("%n");

const stdoutToCommitLines = (stdout: string): string[] => {
  return stdout
    .split(flagCommitBegin)
    .map((value) => value.replace(/^\n/, ""))
    .filter(Boolean);
};

const lineToCommit = (line: string): Commit => {
  const [hash, parentHash, dateTime, author, ...note] = line.split("\n");

  note.pop();

  return {
    hash,
    parentHash: parentHash.split(" "),
    dateTime,
    author,
    message: note.join("\n"),
  };
};

const commitLinesToLog = (lines: string[]): Log => {
  return lines.reduce((memo, line) => {
    const commit = lineToCommit(line);
    memo.set(commit.hash, commit);
    return memo;
  }, new Map());
};

const createCommand = (options: LogOptions = {}) => {
  const { all = false } = options;
  const pretty = `--pretty=format:"${flagCommitBegin}%n${commitFormat}"`;

  return `git log ${all ? "--all" : ""} ${pretty} --`;
};

export const log = async (options: LogOptions = {}): Promise<Log> => {
  const command = createCommand(options);
  const execResult = exec(command, options);

  return execResult.then(stdoutToCommitLines).then(commitLinesToLog);
};

export const logSync = (options: LogOptions = {}): Log => {
  const command = createCommand(options);
  const execResult = execSync(command, options);
  const lines = stdoutToCommitLines(execResult);

  const pipe = logV2({ spawnOptions: options.execOptions });
  pipe.next((value) => {
    console.log(value);
    pipe.destroy();
  });

  return commitLinesToLog(lines);
};
