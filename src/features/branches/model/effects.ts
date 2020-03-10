import { runCommandPipe } from "lib/run-command";
import { createGitProxyEffect } from "lib/added-effector/create-git-proxy-effect";

export const getBranchList = createGitProxyEffect((_, options) => {
  return runCommandPipe(
    "git",
    [
      "branch",
      "-l",
      "-a",
      `--format={"remoteName": "%(upstream:remotename)", "name": "%(refname:lstrip=2)", "refName": "%(refname)", "push": "%(push)", "objectType": "%(objecttype)", "head": "%(HEAD)", "objectName": "%(objectname)"},`,
    ],
    options,
  );
});

export const checkoutBranch = createGitProxyEffect<{ branch: string }>(
  ({ branch }, options) => {
    return runCommandPipe("git", ["checkout", branch], options);
  },
);

export const removeBranch = createGitProxyEffect<{ branch: string }>(
  ({ branch }, options) => {
    return runCommandPipe("git", ["branch", "-D", branch], options);
  },
);

export const publishBranch = createGitProxyEffect<{
  remote: string;
  branch: string;
}>(({ remote, branch }, options) => {
  return runCommandPipe("git", ["push", "-u", remote, branch], options);
});

export const pushCurrentBranch = createGitProxyEffect((_, options) => {
  return runCommandPipe("git", ["push"], options);
});
