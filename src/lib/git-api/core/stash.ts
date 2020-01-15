import { exec } from "./exec";

type Push = (paths?: string[]) => void;

export const push: Push = (paths = []) => {
  exec(`git stash push --keep-index --include-untracked -- ${paths.join(" ")}`);
};
