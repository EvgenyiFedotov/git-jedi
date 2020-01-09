import * as fs from "fs";
import { execSync } from "child_process";

export const getBranches = () => {
  return execSync("git branch -a -l")
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
  range?: [string, string];
}

export const getLogBranch = (options: GetLogBrancOptions = {}) => {
  const { range = [] } = options;
  const logRows = execSync(`git log ${range.filter(Boolean).join("..")}`)
    .toString()
    .split("commit ")
    .filter(Boolean);

  const formatedLogRows = logRows.map(row => {
    let [commit, author, date, sp0, ...noteArr] = row
      .split("\n")
      .map(value => value.trim());

    author = author.replace("Author: ", "").trim();
    date = date.replace("Date: ", "").trim();
    const note = noteArr.join("\n").trim();

    return { commit, author, date, note };
  });

  return formatedLogRows;
};

export const getStatus = () => {
  return execSync("git status -s")
    .toString()
    .split("\n");
};

export const createDirChatBranch = (path: string) => {
  execSync(`mkdir -p ${path}`);
};

export const appendRecordFile = (path: string, value: any) => {
  // execSync("git pull");

  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([value]), "utf-8");
  } else {
    const values = JSON.parse(fs.readFileSync(path, "utf-8"));

    values.push(value);

    fs.writeFileSync(path, JSON.stringify(values));
  }

  execSync(`git add ${path}`);

  try {
    execSync(`git commit -m "message"`);
  } catch (e) {
    execSync(`git checkout HEAD -- ${path}`);
  }
};

export const createMessage = (nameBranch: string, value: string) => {
  const path = `./chats/${nameBranch}/message-hash`;

  execSync(`head -c 128 </dev/urandom >${path}`);
  execSync(`git add ${path}`);

  try {
    execSync(`git commit -m "${value}"`);
  } catch (e) {
    // TODO create file message
    console.log("TODO create file message");
  }
};

export const getBranch = () => {
  return execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .replace("\n", "");
};
