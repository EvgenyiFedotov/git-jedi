import { createStore } from "effector";

import { addChunkLog, Commit } from "../original";
import { MessageFormatted, toMessageFormatted } from "lib/api-git-v2";

export interface CommitCalc {
  messageFormatted: MessageFormatted;
  isMerged: boolean;
  isLast: boolean;
}

export const $logCalc = createStore<Map<string, CommitCalc>>(new Map());

$logCalc.on(addChunkLog, (store, { chunk, index }) => {
  if (index) {
    return new Map([...store, ...toLogCalc(chunk)]);
  }

  return toLogCalc(chunk);
});

export function toLogCalc(log: Map<string, Commit>): Map<string, CommitCalc> {
  const values = Array.from(log.values());

  return values.reduce((memo, commit, index) => {
    memo.set(commit.hash, toCommitCalc(commit, index, values.length));
    return memo;
  }, new Map());
}

export function toCommitCalc(
  commit: Commit,
  index: number,
  length: number,
): CommitCalc {
  return {
    messageFormatted: toMessageFormatted(commit.message),
    isMerged: commit.parentHash.length > 1,
    isLast: index === length - 1,
  };
}
