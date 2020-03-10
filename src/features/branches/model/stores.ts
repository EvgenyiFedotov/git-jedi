import { createStore, restore } from "effector";

import { getBranchList } from "./effects";
import { Branch, Option, BranchGit, changeValue } from "./events";

export const $branchList = createStore<{ ref: Map<string, Branch> }>({
  ref: new Map(),
});

$branchList.on(getBranchList.done, (_, { result }) => {
  if (!(result instanceof Array)) {
    return { ref: new Map() };
  }

  const branches = result
    .filter(({ action }) => action === "data")
    .map<BranchGit[]>(({ value }) =>
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

export const $options = createStore<Option[]>([]);

export const $value = restore(changeValue, "");

function toBranch(branch: BranchGit): Branch {
  return {
    head: branch.head === "*",
    name: branch.name,
    refName: branch.refName,
    objectName: branch.objectName,
    objectType: branch.objectType,
    push: branch.push,
    remoteName: branch.remoteName,
    isRemote: branch.name.split("/").length > 1,
  };
}
