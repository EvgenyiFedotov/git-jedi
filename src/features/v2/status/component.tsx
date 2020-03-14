import * as React from "react";
import { useStore } from "effector-react";
import styled from "styled-components";
import { openStatus } from "features/v2/drawer-status";
import { DiffOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { $status } from "./model";

export const CountChanges: React.FC = () => {
  const count = useStore($status).length;

  return (
    <Tooltip title="Changed files">
      <CountChangesContainer onClick={() => openStatus()}>
        <DiffOutlined /> {count}
      </CountChangesContainer>
    </Tooltip>
  );
};

const CountChangesContainer = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
