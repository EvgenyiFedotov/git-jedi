import * as React from "react";
import styled from "styled-components";
import { LinkBlock } from "ui";
import { useStore } from "effector-react";
import { Spin, Tooltip } from "antd";
import { BranchesOutlined } from "@ant-design/icons";

import { currentBranch } from "model";

export const CurrentBranch: React.FC<{ onClick?: () => void }> = ({
  onClick,
}) => {
  const value = useStore(currentBranch.$currentBranch);

  return (
    <Spin size="small" spinning={!currentBranch}>
      <Tooltip title="Current branch">
        <Container onClick={onClick}>
          <BranchesOutlined />
          {value}
        </Container>
      </Tooltip>
    </Spin>
  );
};

export const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
