import { readFileSync } from "fs";

import { RowContentRabaseTodo } from "./effects";

export const getFileContent = (pathFile: string): string => {
  return readFileSync(pathFile).toString();
};

export const removeComments = (fileContent: string): string => {
  return fileContent.replace(/^\#.*$\n/gm, "").trim();
};

export const getContentFile = (pathFile: string): string => {
  return removeComments(getFileContent(pathFile));
};

export const setIsFirstLast = (
  rows: RowContentRabaseTodo[],
): RowContentRabaseTodo[] => {
  return rows.map((row, index) => {
    row.isFirst = index === 0;
    row.isLast = index === rows.length - 1;
    return row;
  });
};
