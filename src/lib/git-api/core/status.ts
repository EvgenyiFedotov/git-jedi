import { execSplit, exec } from "./exec";

export const get = () => {
  const lines = execSplit("git status -s");

  console.log(lines);
};

export const isChanged = () => {
  return !!exec("git status -s");
};
