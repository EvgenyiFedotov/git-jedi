import * as React from "react";
import { useStore } from "effector-react";
import { Row, Column } from "ui";
import styled from "styled-components";
import { blue } from "@ant-design/colors";

import { $unstagedStatus, StatusFile } from "./model";

export const UnstagedStatus: React.FC = () => {
  const unstagedStatus = useStore($unstagedStatus);

  const list = unstagedStatus.map((statusFile) => (
    <StatusFile key={statusFile.path} statusFile={statusFile} />
  ));

  return <Column>{list}</Column>;
};

const StatusFile: React.FC<{ statusFile: StatusFile }> = ({ statusFile }) => {
  return (
    <Row>
      <StatusFileAction color={blue.primary}>
        {statusFile.unstage}
      </StatusFileAction>
      <div>{statusFile.path}</div>
    </Row>
  );
};

const StatusFileAction = styled.div<{ color?: string }>`
  font-family: monospace;
  font-size: 15px;
  color: ${({ color }) => color};
`;
