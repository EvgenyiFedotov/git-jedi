import * as ef from "effector";

import { $cwd } from "../settings";
import { checkoutTo } from "../change-branch";
import { attachRunCommand } from "../run-command";
import * as st from ".";

ef.forward({
  from: ef.merge([$cwd, checkoutTo.done]),
  to: st.loadBranches,
});

attachRunCommand({
  event: st.loadBranches,
  effect: st.gitBranchList,
});

st.$branches.on(st.gitBranchList.done, (_, { result }) => {
  const branches = result
    .data()
    .map<st.Branch[]>((value) =>
      JSON.parse(`[${value.substr(0, value.length - 2)}]`),
    )
    .reduce((memo, list) => [...memo, ...list], [])
    .filter(({ name, refName }) => name !== refName);

  return branches.reduce<Map<string, st.Branch>>((memo, branch) => {
    const nameArr = branch.name.split("/");

    if (nameArr.length > 1) {
      const [remoteName, ...nameOther] = nameArr;
      const name = nameOther.join("/");

      const branchMemo = memo.get(name);

      if (branchMemo && branchMemo.remoteName === remoteName) {
        branchMemo.remote = branch;
      } else {
        memo.set(branch.name, branch);
      }
    } else {
      memo.set(branch.name, branch);
    }

    return memo;
  }, new Map());
});

// Command: git fetch -p
attachRunCommand({
  event: st.fetchP,
  effect: st.gitFetchP,
});
