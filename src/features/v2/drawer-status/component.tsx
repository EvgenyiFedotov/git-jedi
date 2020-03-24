import * as React from "react";
import { Drawer } from "antd";
import { Column } from "ui";
import { useStore } from "effector-react";
import { UnstagedStatus } from "features/v2/unstaged-status/component";
import { StagedStatus } from "features/v2/staged-status/component";
import styled from "styled-components";

import { $showStatus, closeStatus } from "./model";

export const DrawerStatus: React.FC = () => {
  const showStatus = useStore($showStatus);

  return (
    <Drwr
      title="Changes"
      closable={false}
      visible={showStatus}
      onClose={() => closeStatus()}
      placement="right"
      width="460px"
    >
      <Column>
        <UnstagedStatus />
        <StagedStatus />
      </Column>
    </Drwr>
  );
};

const Drwr = styled(Drawer)`
  max-width: 100%;

  .ant-drawer-content-wrapper {
    max-width: 100%;
  }
`;
