import * as fs from "fs";
import { execSync } from "child_process";

export const getBranches = (origin: boolean = false) => {
  return execSync(`git branch -a -l | grep ${origin ? "" : "-v"} /origin/`)
    .toString()
    .split("\n")
    .map(value => value.trim().replace(/^\* /, ""));
};

export const getFullLogBranch = (branch: string) => {
  const log = fs.readFileSync(`./.git/logs/refs/heads/${branch}`, "utf8");
  const logRows = log.split("\n").filter(Boolean);

  const formatedLogRows = logRows.map(row => {
    const [info, note] = row.split("	");
    const [
      parentCommit,
      commit,
      author,
      authorEmail,
      dateTime,
      dateTimeZone
    ] = info.split(" ");

    return {
      parentCommit,
      commit,
      author,
      authorEmail,
      dateTime,
      dateTimeZone,
      note
    };
  });

  return formatedLogRows;
};

export const getParentBranch = (branch: string = "") => {
  const labels = execSync(
    `git log ${branch} --decorate --simplify-by-decoration --oneline`
  )
    .toString()
    .split("\n");

  for (let index = 1; index < labels.length; index += 1) {
    const label = labels[index];
    const matched = label.match(/\((.*)\)/);

    if (matched) {
      const names = matched[1].split(", ");

      for (let nameIndex = 0; nameIndex < names.length; nameIndex += 1) {
        const name = names[nameIndex];

        if (!name.match(/^origin/)) {
          return name;
        }
      }
    }
  }

  return "";
};

interface GetLogBrancOptions {
  branch?: string;
  range?: [string, string];
}

export const getLogBranch = (options: GetLogBrancOptions = {}) => {
  const { branch = "", range = [] } = options;
  const logRows = execSync(
    `git log ${branch} ${range.filter(Boolean).join("..")} --parents`
  )
    .toString()
    .split("commit ")
    .filter(Boolean);

  const formatedLogRows = logRows.reduce<Map<string, any>>((memo, row) => {
    let [commits, author, date, sp0, ...noteArr] = row
      .split("\n")
      .map(value => value.trim());

    const [commit, parentCommit] = commits.split(" ");
    author = author.replace("Author: ", "").trim();
    date = date.replace("Date: ", "").trim();
    const note = noteArr.join("\n").trim();

    memo.set(commit, { commit, parentCommit, author, date, note });

    return memo;
  }, new Map());

  return formatedLogRows;
};

export const getStatus = () => {
  return execSync("git status -s")
    .toString()
    .split("\n");
};

export const getBranch = () => {
  return execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .replace("\n", "");
};
