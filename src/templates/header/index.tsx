import * as React from "react";
import styled from "styled-components";
import { Icon } from "antd";

import { Path } from "features/path";
import { CurrentBrunch } from "features/current-branch";
import { CreateBranch } from "features/create-branch";
import { Row, css } from "ui";

import { ipcRenderer } from "electron";
import { readFileSync, writeFileSync } from "fs";
import { rebase, execSync } from "lib/api-git";
import { $baseOptions } from "features/state-git";
import { useStore } from "effector-react";

const getFileContent = (pathFile: string): string => {
  return readFileSync(pathFile).toString();
};

const rebaseTodo = (pathFile: string): void => {
  writeFileSync(
    pathFile,
    `r e052e11
p 523e712`,
  );
};

const commitEditMsg = (pathFile: string): void => {
  writeFileSync(pathFile, `feat: add CONST_1 [FIX_CHANGE 3]`);
};

ipcRenderer.on("rebase-query", (event, args: string[]) => {
  const [, , pathFile] = args;
  const arrPath = pathFile.split("/");
  const fileName = arrPath[arrPath.length - 1];

  switch (fileName) {
    case "git-rebase-todo":
      rebaseTodo(pathFile);
      break;
    case "COMMIT_EDITMSG":
      commitEditMsg(pathFile);
      break;
  }

  event.sender.send("rebase-response", getFileContent(pathFile));
});

export const Header: React.FC = () => {
  const baseOptions = useStore($baseOptions);

  const click = () => {
    execSync("rm -fr .git/rebase-merge", baseOptions);
    rebase({
      ...baseOptions,
      target: "HEAD~2",
      interactive: true,
    });
  };

  return (
    <Container>
      <Path />
      <Row>
        <CreateBranch />
        <CurrentBrunch />
        <Icon type="bars" onClick={click} />
      </Row>
    </Container>
  );
};

const Container = styled.div`
  ${css.appFixBlock}
  top: 0;
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  justify-content: space-between;
`;
