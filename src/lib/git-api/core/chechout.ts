import { exec } from "./exec";

type Run = (nameBranch: string) => void;

export const run: Run = nameBranch => {
  exec(`git checkout ${nameBranch}`);
};
