import * as React from "react";
import { useStore } from "effector-react";
import styled from "styled-components";
import { DiffOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { statusFiles } from "model";

export const CountChangesFiles: React.FC = () => {
  const count = useStore(statusFiles.$statusFiles).length;

  return (
    <Tooltip title="Changed files">
      <CountChangesContainer onClick={() => console.log("open changes")}>
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
