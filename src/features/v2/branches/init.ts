import { merge } from "effector";
import {
  createDependRunCommandOptions,
  $cwd,
} from "features/v2/settings/model";

import {
  $branches,
  gitBranches,
  BranchGit,
  Branch,
  loadBranches,
} from "./model";

createDependRunCommandOptions({
  event: merge([loadBranches, $cwd]).map(() => {}),
  effect: gitBranches,
});

$branches.on(gitBranches.done, (_, { result }) => {
  const data = result.data();

  if (!(data instanceof Array)) {
    return { ref: new Map() };
  }

  const branches = data
    .map<BranchGit[]>((value) =>
      JSON.parse(`[${value.substr(0, value.length - 2)}]`),
    )
    .reduce((memo, list) => [...memo, ...list], [])
    .filter(({ name, refName }) => name !== refName);

  const ref = branches.reduce<Map<string, Branch>>((memo, branch) => {
    const nameArr = branch.name.split("/");

    if (nameArr.length > 1) {
      const [remoteName, ...nameOther] = nameArr;
      const name = nameOther.join("/");

      if (name === "HEAD") {
        return memo;
      }

      const branchMemo = memo.get(name);

      if (branchMemo && branchMemo.remoteName === remoteName) {
        // branchMemo.remote = true;
      } else {
        memo.set(branch.name, toBranch(branch));
      }
    } else {
      memo.set(branch.name, toBranch(branch));
    }

    return memo;
  }, new Map());

  return { ref };
});

function toBranch(branch: BranchGit): Branch {
  const [firstChunkName] = branch.name.split("/");

  return {
    head: branch.head === "*",
    name: branch.name,
    refName: branch.refName,
    objectName: branch.objectName,
    objectType: branch.objectType,
    push: branch.push,
    remoteName: branch.remoteName,
    // isRemote: firstChunkName === "origin", // TODO use remote names
  };
}
