import { createFileWatcher } from "lib/file-watcher";
import { parseArgs } from "lib/parse-args";
import { createFileConnector } from "lib/file-connector";
import { readFileSync } from "fs";

import { changePathFile } from "./path-file";
import { changeContentCommitMessageOriginal } from "./content-commit-message";
import { changeContentRebaseTodoOriginal } from "./content-rebase-todo";

export const appPath = parseArgs(process.argv.slice(2))["--app-path"];
export const pathFileRebase = `${appPath}/REBASE_STATE`;

export const fileWatcher = createFileWatcher(pathFileRebase);
export const fileConnector = createFileConnector({
  fileWatcher,
  id: "main",
});

fileConnector.onMessage<string[]>(({ message: [, , pathFile] }) => {
  const arrPath = pathFile.split("/");
  const fileName = arrPath[arrPath.length - 1];
  const content = getContentFile(pathFile);

  changePathFile(pathFile);

  switch (fileName) {
    case "git-rebase-todo":
      changeContentRebaseTodoOriginal(content);
      break;
    case "COMMIT_EDITMSG":
      changeContentCommitMessageOriginal(content);
      break;
  }
});

export function getFileContent(pathFile: string): string {
  return readFileSync(pathFile).toString();
}

export function removeComments(fileContent: string): string {
  return fileContent.replace(/^\#.*$\n/gm, "").trim();
}

export function getContentFile(pathFile: string): string {
  return removeComments(getFileContent(pathFile));
}
