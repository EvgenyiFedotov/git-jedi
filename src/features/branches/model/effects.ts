import { runCommandPipe } from "lib/run-command";
import { createGitProxyEffect } from "lib/added-effector/create-git-proxy-effect";

export const getBranchList = createGitProxyEffect((_, options) => {
  const args: string[] = [
    "branch",
    "-l",
    `--format={"name": "%(refname:lstrip=2)", "refName": "%(refname)", "push": "%(push)", "objectType": "%(objecttype)", "head": "%(HEAD)", "objectName": "%(objectname)"},`,
  ];

  return runCommandPipe("git", args, options);
});

export const checkoutBranch = createGitProxyEffect<{ branch: string }>(
  ({ branch }, options) => {
    const args: string[] = ["checkout", branch];

    return runCommandPipe("git", args, options);
  },
);
