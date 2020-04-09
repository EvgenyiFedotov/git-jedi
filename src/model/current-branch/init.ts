import * as ef from "effector";

import { $cwd } from "../settings";
import { checkoutTo } from "../change-branch";
import { attachRunCommand } from "../run-command";
import * as st from ".";

ef.forward({
  from: ef.merge([$cwd, checkoutTo.done]),
  to: st.loadCurrentBranch,
});

attachRunCommand({
  event: st.loadCurrentBranch,
  effect: st.gitCurrentBranchName,
});

ef.guard({
  source: st.$currentBranch,
  filter: (value) => value === "HEAD",
  target: st.loadCurrentBranchByHash.prepend((_: any) => {}),
});

attachRunCommand({
  event: st.loadCurrentBranchByHash,
  effect: st.gitCurrentBranchHash,
});

st.$currentBranch.on(st.gitCurrentBranchName.done, (_, { result }) =>
  toCurrentBranch(result.data()[0]),
);

st.$currentBranch.on(st.gitCurrentBranchHash.done, (_, { result }) =>
  toCurrentBranch(result.data()[0]).slice(0, 8),
);

st.$currentBranch.on(
  ef.merge([st.gitCurrentBranchName.fail, st.gitCurrentBranchHash.fail]),
  () => "",
);

function toCurrentBranch(value: string): string {
  return value.replace("\n", "").trim();
}
