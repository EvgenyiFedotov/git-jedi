import { restore, createStore } from "effector";

import { diffLog } from "./effects";

export const $diffLog = restore(
  diffLog.done.map(({ result }) => ({
    pull: result.pull,
    push: result.push,
  })),
  { pull: new Map(), push: new Map() },
);

export const $pendingDiffLog = createStore<boolean>(false);

$pendingDiffLog.on(diffLog, () => true);
$pendingDiffLog.on(diffLog.finally, () => false);
