import { parseArgs } from "lib/parse-args";
import { createFileWatcher } from "lib/file-watcher";
import { createFileConnector } from "lib/file-connector";
import { readFileSync } from "fs";

import { changePathFile } from "./path-file";
import { changeContentFile } from "./events";

const appPath = parseArgs(process.argv.slice(2))["--app-path"];
const pathFileRebase = `${appPath}/REBASE_STATE`;

export const fileWatcher = createFileWatcher(pathFileRebase);
export const fileConnector = createFileConnector({
  fileWatcher,
  id: "main",
});

fileConnector.onMessage<string[]>(({ message: [, , pathFile] }) => {
  const arrPath = pathFile.split("/");
  const fileName = arrPath[arrPath.length - 1];
  const content = getContentFile(pathFile);

  console.log(pathFile);

  changePathFile(pathFile);
  changeContentFile({ fileName, content });
});

function getFileContent(pathFile: string): string {
  return readFileSync(pathFile).toString();
}

function removeComments(fileContent: string): string {
  return fileContent.replace(/^\#.*$\n/gm, "").trim();
}

function getContentFile(pathFile: string): string {
  return removeComments(getFileContent(pathFile));
}
