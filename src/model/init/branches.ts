import * as ef from "effector";

import { $cwd } from "../static/settings";
import { attachRunCommand } from "../static/run-command";
import * as model from "../static/branches";

ef.forward({
  from: $cwd,
  to: model.loadBranches,
});

model.loadBranches.watch(() => console.log("load"));

attachRunCommand({
  event: model.loadBranches,
  effect: model.gitBranchList,
});

model.$branches.on(model.gitBranchList.done, (_, { result }) => {
  const branches = result
    .data()
    .map<model.Branch[]>((value) =>
      JSON.parse(`[${value.substr(0, value.length - 2)}]`),
    )
    .reduce((memo, list) => [...memo, ...list], [])
    .filter(({ name, refName }) => name !== refName);

  return branches.reduce((memo, branch) => {
    const nameArr = branch.name.split("/");

    if (nameArr.length > 1) {
      const [remoteName, ...nameOther] = nameArr;
      const name = nameOther.join("/");

      const branchMemo = memo.get(name);

      if (branchMemo && branchMemo.remoteName === remoteName) {
      } else {
        memo.set(branch.name, branch);
      }
    } else {
      memo.set(branch.name, branch);
    }

    return memo;
  }, new Map());
});
