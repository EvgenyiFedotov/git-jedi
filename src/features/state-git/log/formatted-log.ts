import { combine, Store } from "effector";
import { Log, Commit as CommitGit, Ref } from "lib/api-git";

import { $originalLog } from "./original-log";
import { $byCommitHashRefs } from "../refs";

export interface FormattedCommit extends CommitGit {
  key: string;
  type: string;
  scope: string;
  note: string;
  refs: Ref[];
  isMerged: boolean;
}

interface CombineStores {
  originalLog: Store<Log>;
  byCommitHashRefs: Store<Map<string, Ref[]>>;
}

type FormattedLog = Map<string, FormattedCommit>;

export const $formattedLog = combine<CombineStores, FormattedLog>(
  { originalLog: $originalLog, byCommitHashRefs: $byCommitHashRefs },
  (stores) => formatLog(stores),
);

interface FormatLogParams {
  originalLog: Log;
  byCommitHashRefs: Map<string, Ref[]>;
}

function formatLog({
  originalLog,
  byCommitHashRefs,
}: FormatLogParams): FormattedLog {
  const commits = Array.from(originalLog.values());

  return commits.reduce((memo, commit) => {
    memo.set(commit.hash, formatCommit(commit, byCommitHashRefs));
    return memo;
  }, new Map());
}

function formatCommit(
  commit: CommitGit,
  byCommitHashRefs: Map<string, Ref[]>,
): FormattedCommit {
  const { hash } = commit;
  const { type, scope, note } = getTypeCommit(commit);
  const isMerged = getIsMerged(commit);

  return {
    ...commit,
    key: hash,
    refs: byCommitHashRefs.get(hash) || [],
    type,
    scope,
    note,
    isMerged,
  };
}

function getTypeCommit(
  commit: CommitGit,
): { type: string; note: string; scope: string } {
  const regOnlyType = /^([\w_]*):/;
  let matchResult = commit.message.match(regOnlyType);

  if (matchResult) {
    const type = matchResult[1];
    const note = commit.message.replace(regOnlyType, "").trim();

    return { type, note, scope: "" };
  }

  const regWithScope = /^([\w_]*)\(([\w_/-]*)\):/;
  matchResult = commit.message.match(regWithScope);

  if (matchResult) {
    const type = matchResult[1];
    const scope = matchResult[2].trim();
    const note = commit.message.replace(regWithScope, "").trim();

    return { type, note, scope };
  }

  return { type: "", scope: "", note: commit.message };
}

function getIsMerged(commit: CommitGit): boolean {
  return commit.parentHash.length > 1;
}
