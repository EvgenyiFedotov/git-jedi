import { combine, Store } from "effector";
import { Log, Commit as CommitGit, Ref } from "lib/api-git";

import { $originalLog } from "./original-log";

export interface Commit extends CommitGit {
  key: string;
  type: string;
  scope: string;
  refs: Ref[];
  isMerged: boolean;
}

interface CombineStores {
  originalLog: Store<Log>;
}

type FormattedLog = Map<string, Commit>;

export const $formatterdLog = combine<CombineStores, FormattedLog>(
  { originalLog: $originalLog },
  ({ originalLog }) => formatLog(originalLog),
);

function formatLog(log: Log): FormattedLog {
  const commits = Array.from(log.values());

  return commits.reduce((memo, commit) => {
    memo.set(commit.hash, formatCommit(commit));
    return memo;
  }, new Map());
}

function formatCommit(commit: CommitGit): Commit {
  const { type, scope, note } = getTypeCommit(commit);
  const isMerged = getIsMerged(commit);

  return {
    ...commit,
    key: commit.hash,
    refs: [],
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
  let matchResult = commit.note.match(regOnlyType);

  if (matchResult) {
    const type = matchResult[1];
    const note = commit.note.replace(regOnlyType, "").trim();

    return { type, note, scope: "" };
  }

  const regWithScope = /^([\w_]*)\(([\w_/-]*)\):/;
  matchResult = commit.note.match(regWithScope);

  if (matchResult) {
    const type = matchResult[1];
    const scope = matchResult[2].trim();
    const note = commit.note.replace(regWithScope, "").trim();

    return { type, note, scope };
  }

  return { type: "", scope: "", note: commit.note };
}

function getIsMerged(commit: CommitGit): boolean {
  return commit.parentHash.length > 1;
}
