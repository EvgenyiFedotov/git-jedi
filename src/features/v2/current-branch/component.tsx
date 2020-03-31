import * as React from "react";
import styled from "styled-components";
import { LinkBlock } from "ui";
import { useStore } from "effector-react";
import { Spin } from "antd";
import { BranchesOutlined } from "@ant-design/icons";
import { openBranchList } from "features/v2/drawer-branch-list/model";

import { updateCurrentBranch, $currentBranch } from "./model";

export const CurrentBranch: React.FC = () => {
  const currentBranch = useStore($currentBranch);

  const click = React.useCallback(() => {
    openBranchList();
  }, []);

  // React.useEffect(() => {
  //   updateCurrentBranch();
  // }, []);

  return (
    <Spin size="small" spinning={!currentBranch}>
      <Container onClick={click}>
        <BranchesOutlined />
        {currentBranch}
      </Container>
    </Spin>
  );
};

export const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
