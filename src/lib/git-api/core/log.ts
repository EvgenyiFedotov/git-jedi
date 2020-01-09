import { exetOut } from "./exec-out";

const getLabels = (branch: string = "") => {
  return exetOut(
    `git log ${branch} --decorate --simplify-by-decoration --oneline`
  );
};

interface Label {
  type: "branch" | "tag";
  name: string;
}

export const getParentLabel = (branch: string = ""): Label | null => {
  const labels = getLabels(branch);

  for (let index = 1; index < labels.length; index += 1) {
    const label = labels[index];
    const matched = label.match(/\((.*)\)/);

    if (matched) {
      const names = matched[1].split(", ");

      for (let nameIndex = 0; nameIndex < names.length; nameIndex += 1) {
        const name = names[nameIndex];

        if (!name.match(/^origin/)) {
          return { type: "branch", name };
        }
      }
    }
  }

  return null;
};

export interface Log {
  commit: string;
  parentCommit: string;
  author: string;
  date: string;
  note: string;
}

const createLog = (commitLine: string): Log => {
  let [hashs, author, date, sp0, ...noteArr] = commitLine
    .split("\n")
    .map(value => value.trim());

  const [commit, parentCommit] = hashs.split(" ");
  const note = noteArr.join("\n").trim();

  author = author.replace("Author: ", "").trim();
  date = date.replace("Date: ", "").trim();

  return { commit, parentCommit, author, date, note };
};

export const get = (branch: string | [string, string] = "") => {
  const range =
    branch instanceof Array ? branch.filter(Boolean).join("..") : branch;
  const commits = exetOut(`git log ${range} --parents`, "commit ").filter(
    Boolean
  );

  return commits.reduce<Map<string, Log>>((memo, commit) => {
    const log = createLog(commit);

    memo.set(log.commit, log);

    return memo;
  }, new Map());
};
