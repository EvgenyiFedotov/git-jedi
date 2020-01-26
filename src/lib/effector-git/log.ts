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
import { $refsByCommitHash } from "./refs";
import { $currentBranch } from "./current-branch";

import { committing } from "../../app-v2/features/log/model";

export interface Commit extends GitCommit {
  key: string;
  refs: Ref[];
}

type Log = Map<string, Commit>;

const toLog = (gitLog: GitLog): Log => {
  const refsByCommitHash = $refsByCommitHash.getState();

  return Array.from(gitLog.values()).reduce<Log>((memo, commit) => {
    const refs = refsByCommitHash.get(commit.hash) || [];
    memo.set(commit.hash, { ...commit, key: commit.hash, refs });
    return memo;
  }, new Map());
};

let defaultLog;
try {
  defaultLog = toLog(
    logSync({
      ...$baseOptions.getState(),
      onReject: () => {}
    })
  );
} catch (error) {
  defaultLog = new Map();
}

export const $log = createStore<Log>(defaultLog);

const updateLog = createEffect<void, Log>({
  handler: () => log($baseOptions.getState()).then(toLog)
});

forward({ from: $baseOptions, to: updateLog });

forward({ from: $currentBranch, to: updateLog });

forward({ from: committing.done, to: updateLog });

$log.on(updateLog.done, (_, { result }) => result);
$log.on(updateLog.fail, () => new Map());
