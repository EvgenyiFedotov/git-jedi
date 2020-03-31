import * as ef from "effector";
import { $branches } from "features/v2/branches/model";
import { createDependRunCommandOptions } from "features/v2/settings/model";

import * as model from "./model";

// Calc published
const $currentBranch = $branches.map(({ ref }) => {
  return Array.from(ref.values()).filter(({ head }) => head)[0] ?? null;
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

createDependRunCommandOptions({
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

createDependRunCommandOptions({
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
