import * as React from "react";
import styled from "styled-components";
import { LinkBlock } from "ui";
import { useStore } from "effector-react";
import { Spin } from "antd";

import { getCurrentBranch, $currentBranch } from "../model";

export const CurrentBranch: React.FC = () => {
  const currentBranch = useStore($currentBranch);

  const update = React.useCallback(() => {
    getCurrentBranch();
  }, []);

  React.useEffect(() => {
    getCurrentBranch();
  }, []);

  return (
    <Spin size="small" spinning={!currentBranch}>
      <Container onClick={update}>{currentBranch}</Container>
    </Spin>
  );
};

export const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
