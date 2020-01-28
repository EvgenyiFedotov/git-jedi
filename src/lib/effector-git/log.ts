import { createStore, forward, createEffect } from "effector";
import {
  log,
  logSync,
  Log as GitLog,
  Commit as GitCommit,
  Ref
} from "../api-git";
import { $baseOptions } from "./config";
import { $refsByCommitHash } from "./refs";
import { $currentBranch } from "./current-branch";

import { committing } from "../../app-v2/features/log/model";

export interface Commit extends GitCommit {
  key: string;
  type: string;
  scope: string;
  refs: Ref[];
  isMerged: boolean;
}

type Log = Map<string, Commit>;

const getTypeCommit = (
  message: string
): { type: string; note: string; scope: string } => {
  const regOnlyType = /^([\w_]*):/;
  let matchResult = message.match(regOnlyType);

  if (matchResult) {
    const type = matchResult[1];
    const note = message.replace(regOnlyType, "").trim();

    return { type, note, scope: "" };
  }

  const regWithScope = /^([\w_]*)\(([\w_/-]*)\):/;
  matchResult = message.match(regWithScope);

  if (matchResult) {
    const type = matchResult[1];
    const scope = matchResult[2].trim();
    const note = message.replace(regWithScope, "").trim();

    return { type, note, scope };
  }

  return { type: "", scope: "", note: message };
};

const getIsMerged = (commit: GitCommit): boolean => {
  return commit.parentHash.length > 1;
};

const toLog = (gitLog: GitLog): Log => {
  const refsByCommitHash = $refsByCommitHash.getState();

  return Array.from(gitLog.values()).reduce<Log>((memo, commit) => {
    const { hash, note } = commit;
    const refs = refsByCommitHash.get(hash) || [];
    const typeCommit = getTypeCommit(note);
    const isMerged = getIsMerged(commit);

    memo.set(hash, {
      ...commit,
      key: hash,
      refs,
      type: typeCommit.type,
      scope: typeCommit.scope,
      note: typeCommit.note,
      isMerged
    });

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
