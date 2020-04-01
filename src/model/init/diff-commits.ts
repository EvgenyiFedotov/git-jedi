import * as ef from "effector";

import { $branches } from "../static/branches";
import { attachRunCommand } from "../static/run-command";
import { $remotes } from "../static/git-config";
import * as model from "../static/diff-commits";

// Calc published
const $currentBranch = $branches.map((branches) => {
  return (
    Array.from(branches.values()).filter(({ head }) => head === "*")[0] ?? null
  );
});

model.$published.on($currentBranch, (_, currBranch) => !!currBranch.remoteName);

// Diff pull
const diffPullParams = ef.sample({
  source: $currentBranch,
  clock: ef.guard({
    source: $currentBranch,
    filter: ({ remoteName }) => !!remoteName,
  }),
  fn: (currBranch) => {
    const from = currBranch.name;
    const to = `${currBranch.remoteName}/${currBranch.name}`;

    return { range: `${from}..${to}` };
  },
});

attachRunCommand({
  event: diffPullParams,
  effect: model.diffPull,
});

const diffPull = model.diffPull.done.map(({ result }) => {
  return result.data().reduce((memo, value) => {
    return memo + value.split("\n").length - 1;
  }, 0);
});

ef.forward({
  from: diffPull,
  to: model.$diffPull,
});

// Diff push
const diffPushParams = ef.sample({
  source: $currentBranch,
  clock: ef.guard({
    source: $currentBranch,
    filter: ({ remoteName }) => !!remoteName,
  }),
  fn: (currBranch) => {
    const from = `${currBranch.remoteName}/${currBranch.name}`;
    const to = currBranch.name;

    return { range: `${from}..${to}` };
  },
});

attachRunCommand({
  event: diffPushParams,
  effect: model.diffPush,
});

const diffPush = model.diffPush.done.map(({ result }) => {
  return result.data().reduce((memo, value) => {
    return memo + value.split("\n").length - 1;
  }, 0);
});

ef.forward({
  from: diffPush,
  to: model.$diffPush,
});

// Get $existRemote
model.$existRemote.on($remotes, (_, remotes) => !!remotes.size);
