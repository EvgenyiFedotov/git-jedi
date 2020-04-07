import * as React from "react";
import styled from "styled-components";
import { LinkBlock } from "ui";
import { useStore } from "effector-react";
import { Spin, Tooltip, Drawer } from "antd";
import { BranchesOutlined } from "@ant-design/icons";
import { createVisible } from "lib/added-effector/visible";
import { BranchList } from "components/branch-list";

import { currentBranch } from "model";

export const visibleBranchList = createVisible();

export const CurrentBranch: React.FC = () => {
  const value = useStore(currentBranch.$currentBranch);

  return (
    <Spin size="small" spinning={!currentBranch}>
      <Tooltip title="Current branch">
        <Container onClick={() => visibleBranchList.show()}>
          <BranchesOutlined />
          {value}
        </Container>
      </Tooltip>
      <DrawerBranchList />
    </Spin>
  );
};

const DrawerBranchList: React.FC = () => {
  const visible = useStore(visibleBranchList.$value);

  return (
    <Drawer
      title="Branch list"
      closable={false}
      visible={visible}
      onClose={() => visibleBranchList.hide()}
      placement="right"
      width="460px"
    >
      <BranchList />
    </Drawer>
  );
};

export const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
