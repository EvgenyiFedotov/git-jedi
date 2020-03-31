import * as React from "react";
import styled from "styled-components";
import { RowBase } from "ui";
import { PathRepo } from "features/v2/path-repo";
import { Divider } from "antd";
import { CurrentBranch } from "features/v2/current-branch";
import { CountChanges } from "features/v2/status";
import { DiffCommits } from "features/v2/diff-commits/component";

export const Footer: React.FC = () => {
  return (
    <Container>
      <RowBase>
        <PathRepo />
        <Divider type="vertical" />
        <CurrentBranch />
        <Divider type="vertical" />
        <CountChanges />
        <Divider type="vertical" />
        <DiffCommits />
      </RowBase>
      <RowBase></RowBase>
    </Container>
  );
};

const Container = styled(RowBase)`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 24px;
  padding: 8px;
  background-color: white;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
