import { exec } from "./exec";

export const getCurrentBranch = () => {
  return exec("git rev-parse --abbrev-ref HEAD").replace("\n", "");
};

export const getCurrentCommitHash = () => {
  return exec("git rev-parse --verify HEAD").replace("\n", "");
};
