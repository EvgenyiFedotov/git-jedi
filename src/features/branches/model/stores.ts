import { createStore, restore } from "effector";

import { getBranchList } from "./effects";
import { Branch, Option, BranchGit, changeValue } from "./events";

export const $branchList = createStore<Branch[]>([]);

$branchList.on(getBranchList.done, (_, { result }) => {
  if (!(result instanceof Array)) {
    return [];
  }

  const branches = result
    .filter(({ action }) => action === "data")
    .map<BranchGit[]>(({ value }) =>
      JSON.parse(`[${value.substr(0, value.length - 2)}]`),
    )
    .reduce((memo, list) => [...memo, ...list], [])
    .filter(({ name, refName }) => name !== refName);

  return branches.map<Branch>((branch) => ({
    head: branch.head === "*",
    name: branch.name,
    refName: branch.refName,
    objectName: branch.objectName,
    objectType: branch.objectType,
    push: branch.push,
  }));
});

export const $options = createStore<Option[]>([]);

export const $value = restore(changeValue, "");
