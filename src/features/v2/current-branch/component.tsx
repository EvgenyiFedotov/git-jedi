import * as React from "react";
import styled from "styled-components";
import { LinkBlock } from "ui";
import { useStore } from "effector-react";
import { Spin } from "antd";
import { BranchesOutlined } from "@ant-design/icons";

import { updateCurrentBranch, $currentBranch } from "./model";

export const CurrentBranch: React.FC = () => {
  const currentBranch = useStore($currentBranch);

  const update = React.useCallback(() => {
    updateCurrentBranch();
  }, []);

  React.useEffect(() => {
    updateCurrentBranch();
  }, []);

  return (
    <Spin size="small" spinning={!currentBranch}>
      <Container onClick={update}>
        <BranchesOutlined />
        {currentBranch}
      </Container>
    </Spin>
  );
};

export const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
