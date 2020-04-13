import * as React from "react";
import { Column, RowBase } from "ui";
import styled from "styled-components";
import { Init } from "components/init";
import { Divider } from "antd";
import { PathRepo } from "components/path-repo";
import { CurrentBranch } from "components/current-branch";
import { DiffCommits } from "components/diff-commits";
import { ButtonSettings } from "components/button-settings";
import { UnstagedFiles } from "components/unstaged-files";
import { StagedFiles } from "components/staged-files";

export const App: React.FC = () => {
  return (
    <SApp>
      <Init>
        <Content />
        <Footer />
      </Init>
    </SApp>
  );
};

const Content: React.FC = () => {
  return (
    <Column>
      <UnstagedFiles />
      <StagedFiles />
    </Column>
  );
};

const Footer: React.FC = () => {
  return (
    <SFooter>
      <RowBase>
        <PathRepo />
        <Divider type="vertical" />
        <CurrentBranch />
        <Divider type="vertical" />
        <DiffCommits />
      </RowBase>

      <RowBase>
        <ButtonSettings />
      </RowBase>
    </SFooter>
  );
};

const SApp = styled.div``;

const SFooter = styled(RowBase)`
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 24px;
  padding: 0 8px;
  background-color: white;
  border-top: 1px solid #f5f5f5;
`;
