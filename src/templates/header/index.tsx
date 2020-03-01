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
import { useStore } from "effector-react";
import { Branch } from "lib/branch";

import { $visibleRemoteUrl, changeVisibleRemoteUrl } from "./model";

export const Header: React.FC = () => {
  const visibleRemoteUrl = useStore($visibleRemoteUrl);

  const closeRemoteUrl = React.useCallback(
    () => changeVisibleRemoteUrl.hide(),
    [],
  );

  return (
    <Container>
      <Path />
      <Row>
        <Branch if={visibleRemoteUrl}>
          <>
            <RemoteAdd onClose={closeRemoteUrl} />
          </>
          <>
            <Commands />
            <DiffCommits />
            <CreateBranch />
            <CurrentBrunch />
            <GitConfig />
          </>
        </Branch>
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
