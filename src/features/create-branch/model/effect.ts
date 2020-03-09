import { createGitProxyEffect } from "lib/added-effector/create-git-proxy-effect";
import { runCommandPipe } from "lib/run-command";

export const createBranch = createGitProxyEffect<{ branch: string }>(
  ({ branch }, options) => {
    return runCommandPipe("git", ["checkout", "-b", branch], options);
  },
);
