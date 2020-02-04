import { Log, Commit as CommitGit, Ref } from "lib/api-git";

export interface FormatLogParams {
  originalLog: Log;
  byCommitHashRefs: Map<string, Ref[]>;
}
export interface FormattedCommit extends CommitGit {
  key: string;
  type: string;
  scope: string;
  note: string;
  refs: Ref[];
  isMerged: boolean;
  isLast: boolean;
}

export type FormattedLog = Map<string, FormattedCommit>;

export function formatLog({
  originalLog,
  byCommitHashRefs,
}: FormatLogParams): FormattedLog {
  const commits = Array.from(originalLog.values());

  return commits.reduce((memo, commit, index) => {
    memo.set(
      commit.hash,
      formatCommit({ commit, byCommitHashRefs, index, commits }),
    );
    return memo;
  }, new Map());
}

export interface FormatCommitParams {
  commit: CommitGit;
  byCommitHashRefs: Map<string, Ref[]>;
  index: number;
  commits: CommitGit[];
}

export function formatCommit(params: FormatCommitParams): FormattedCommit {
  const { commit, commits, index, byCommitHashRefs } = params;
  const { hash } = commit;
  const { type, scope, note } = getFormatCommmitMessage(commit.message);
  const isMerged = getIsMerged(commit);

  return {
    ...commit,
    key: hash,
    refs: byCommitHashRefs.get(hash) || [],
    type,
    scope,
    note,
    isMerged,
    isLast: index === commits.length - 1,
  };
}

export interface FormattedCommitMessage {
  type: string;
  note: string;
  scope: string;
}

export function getFormatCommmitMessage(
  message: string,
): FormattedCommitMessage {
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
}

export function formattedCommitMessageToString(
  message: FormattedCommitMessage,
): string {
  return `${message.type}: ${message.note.trim()}`;
}

export function getIsMerged(commit: CommitGit): boolean {
  return commit.parentHash.length > 1;
}
