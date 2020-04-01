import * as React from "react";
import styled from "styled-components";
import { LinkBlock } from "ui";
import { useStore } from "effector-react";
import { Spin } from "antd";
import { BranchesOutlined } from "@ant-design/icons";

import { currentBranch } from "model";

export const CurrentBranch: React.FC = () => {
  const value = useStore(currentBranch.$currentBranch);

  return (
    <Spin size="small" spinning={!currentBranch}>
      <Container>
        <BranchesOutlined />
        {value}
      </Container>
    </Spin>
  );
};

export const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
