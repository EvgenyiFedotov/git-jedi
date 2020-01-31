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

ipcRenderer.on("asynchronous-reply", (event, args: string[]) => {
  console.log(args);
});

export const Header: React.FC = () => {
  const baseOptions = useStore($baseOptions);

  const click = () => {
    execSync("rm -fr .git/rebase-merge", baseOptions);
    ipcRenderer.once("asynchronous-reply", (event, args: string[]) => {
      const file = readFileSync(args[2]).toString();
      console.log(file);

      writeFileSync(
        args[2],
        `pick e052e11 feat: add CONST_1
s 523e712 feat: add CONST_4`,
      );

      const filer = readFileSync(args[2]).toString();
      console.log(filer);

      event.sender.send("asynchronous-message", "WRITED_FILE");
    });
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
