import * as React from "react";
import styled from "styled-components";

import { Path } from "features/path";
import { CurrentBrunch } from "features/current-branch";
import { CreateBranch } from "features/create-branch";
import { Row, css } from "ui";
import { DiffCommits } from "features/diff-commits";
import { Commands } from "features/commands";
import { Config as GitConfig } from "features/git-config";
import { RemoteAdd } from "features/remote-add";

export const Header: React.FC = () => {
  return (
    <Container>
      <Path />
      <Row>
        <Commands />
        <DiffCommits />
        <CreateBranch />
        <CurrentBrunch />
        <GitConfig />
        <RemoteAdd />
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
