import { runCommandPipe } from "lib/run-command";
import { createGitProxyEffect } from "lib/added-effector/create-git-proxy-effect";

const args: string[] = [
  "branch",
  "-l",
  `--format={"name": "%(refname:lstrip=2)", "refName": "%(refname)", "push": "%(push)", "objectType": "%(objecttype)", "head": "%(HEAD)", "objectName": "%(objectname)"},`,
];

export const getBranchList = createGitProxyEffect((_, options) =>
  runCommandPipe("git", args, options),
);
