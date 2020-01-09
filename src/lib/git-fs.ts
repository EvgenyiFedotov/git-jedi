import * as fs from "fs";
import { execSync } from "child_process";

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
