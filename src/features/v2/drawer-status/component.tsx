import * as React from "react";
import { Drawer } from "antd";
import { Column } from "ui";
import { useStore } from "effector-react";
import { UnstagedStatus } from "features/v2/unstaged-status";
import { StagedStatus } from "features/v2/staged-status";

import { $showStatus, closeStatus } from "./model";

export const DrawerStatus: React.FC = () => {
  const showStatus = useStore($showStatus);

  return (
    <Drawer
      title="Status"
      closable={false}
      visible={showStatus}
      onClose={() => closeStatus()}
      placement="right"
    >
      <Column>
        <UnstagedStatus />
        <StagedStatus />
      </Column>
    </Drawer>
  );
};
