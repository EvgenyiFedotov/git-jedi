import { createStore, forward, createEffect } from "effector";
import {
  log,
  logSync,
  Log as GitLog,
  Commit as GitCommit,
  BaseOptions,
  Ref
} from "../api-git";
import { $baseOptions } from "./config";
import { $refs, byCommitHash } from "./refs";

export interface Commit extends GitCommit {
  key: string;
  refs: Ref[];
}

type Log = Map<string, Commit>;

const toLog = (gitLog: GitLog): Log => {
  const refsByCommitHash = byCommitHash($refs.getState());
  return Array.from(gitLog.values()).reduce<Log>((memo, commit) => {
    const refs = refsByCommitHash.get(commit.hash) || [];
    memo.set(commit.hash, { ...commit, key: commit.hash, refs });
    return memo;
  }, new Map());
};

const defaultGitLog = logSync($baseOptions.getState());
const defaultLog = toLog(defaultGitLog);

export const $log = createStore<Log>(defaultLog);

const updateLog = createEffect<BaseOptions, Log>({
  handler: options => log(options).then(toLog)
});

forward({ from: $baseOptions, to: updateLog });

$log.on(updateLog.done, (_, { result }) => result);
