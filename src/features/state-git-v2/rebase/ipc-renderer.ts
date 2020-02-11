import { ipcRenderer } from "electron";
import { readFileSync } from "fs";

import { changePathFile } from "./path-file";
import { changeContentCommitMessageOriginal } from "./content-commit-message";
import { changeContentRebaseTodoOriginal } from "./content-rebase-todo";

ipcRenderer.on("rebase-query", (event, [, , pathFile]: string[]) => {
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
