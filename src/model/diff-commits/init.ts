import * as ef from "effector";
import { createCheck } from "lib/added-effector/create-check";

import { $branches } from "../branches";
import { attachRunCommand } from "../run-command";
import { $remotes } from "../git-config";
import * as st from ".";

// Calc published
const $currentBranch = $branches.map((branches) => {
  return (
    Array.from(branches.values()).filter(({ head }) => head === "*")[0] ?? null
  );
});

st.$published.on($currentBranch, (_, currBranch) => !!currBranch.remoteName);

// Exist remote for $currentBranch
const isExistRemote = createCheck(
  $currentBranch,
  ({ remoteName, remote }) => !!(remoteName && remote),
);

// Diff pull
const diffPullParams = ef.sample({
  source: $currentBranch,
  clock: isExistRemote.done,
  fn: (currBranch) => {
    const from = currBranch.name;
    const to = `${currBranch.remoteName}/${currBranch.name}`;

    return { range: `${from}..${to}` };
  },
});

attachRunCommand({
  event: diffPullParams,
  effect: st.diffPull,
});

const diffPull = st.diffPull.done.map(({ result }) => {
  return result.data().reduce((memo, value) => {
    return memo + value.split("\n").length - 1;
  }, 0);
});

ef.forward({
  from: diffPull,
  to: st.$diffPull,
});

// Diff push
const diffPushParams = ef.sample({
  source: $currentBranch,
  clock: isExistRemote.done,
  fn: (currBranch) => {
    const from = `${currBranch.remoteName}/${currBranch.name}`;
    const to = currBranch.name;

    return { range: `${from}..${to}` };
  },
});

attachRunCommand({
  event: diffPushParams,
  effect: st.diffPush,
});

const diffPush = st.diffPush.done.map(({ result }) => {
  return result.data().reduce((memo, value) => {
    return memo + value.split("\n").length - 1;
  }, 0);
});

ef.forward({
  from: diffPush,
  to: st.$diffPush,
});

// Get $existRemote
st.$existRemote.on($remotes, (_, remotes) => !!remotes.size);

// Reset $diffPull, $diffPush
st.$diffPull.on(isExistRemote.fail, () => 0);

st.$diffPush.on(isExistRemote.fail, () => 0);
