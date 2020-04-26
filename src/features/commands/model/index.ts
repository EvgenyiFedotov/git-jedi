import { gitCommand } from "./git-command";
import { ResultPromise } from "lib/create-command";

import { Branch } from "./types";

export const currentBranchName = () =>
  gitCommand("rev-parse", ["--abbrev-ref", "HEAD"]).then((result) =>
    result.data()[0].replace("\n", "").trim(),
  );

export const currentBranchHash = () =>
  gitCommand("rev-parse", ["--verify", "HEAD"]).then((result) =>
    result.data()[0].replace("\n", "").trim(),
  );

export const branchList = () =>
  gitCommand("branch", [
    "-l",
    "-a",
    `--format={"remoteName": "%(upstream:remotename)", "name": "%(refname:lstrip=2)", "refName": "%(refname)", "push": "%(push)", "objectType": "%(objecttype)", "head": "%(HEAD)", "objectName": "%(objectname)"},`,
  ]).then(formatBranchList);

export const fetchP = () => gitCommand("fetch", ["-p"]);

type CheckoutToParams = {
  branch: Branch;
};

export const checkoutTo = ({ branch }: CheckoutToParams) => {
  const nameArr = branch.name.split("/");
  let name = branch.name;

  // TODO check list remotes
  if (nameArr[0] === "origin" && !branch.remoteName) {
    nameArr.shift();
    name = nameArr.join("/");
  }

  return gitCommand("checkout", [name]);
};

// Added
function formatBranchList(result: ResultPromise) {
  const branches = result
    .data()
    .map<Branch[]>((value) =>
      JSON.parse(`[${value.substr(0, value.length - 2)}]`),
    )
    .reduce((memo, list) => [...memo, ...list], [])
    .filter(({ name, refName }) => name !== refName);

  return branches.reduce<Map<string, Branch>>((memo, branch) => {
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
}
