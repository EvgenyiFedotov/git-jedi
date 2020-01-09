import * as fs from "fs";
import { execSync } from "child_process";

export const getBranches = () => {
  return execSync("git branch -a -l")
    .toString()
    .split("\n");
};

export const getBranchLog = (branch: string) => {
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

export const getCurrentBranch = () => {
  const branches = getBranches();

  return (
    branches
      .filter(branch => branch.match(/^\* /))
      .map(branch => branch.replace(/^\* /, ""))[0] || ""
  );
};
