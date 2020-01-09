import { execSync } from "child_process";

export const getCurrentBranch = () => {
  return execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .replace("\n", "");
};
