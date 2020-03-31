import * as React from "react";
import {
  CloudUploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { RowBase, Row } from "ui";
import styled from "styled-components";
import { Tooltip, Spin } from "antd";
import { useStore } from "effector-react";
import { Branch } from "lib/branch";

import * as model from "./model";

export const DiffCommits: React.FC = () => {
  const published = useStore(model.$published);

  return (
    <Spin size="small" spinning={published === null}>
      <Row>
        <Branch if={published === true}>
          <>
            <DiffPull />
            <DiffPush />
          </>
          <Tooltip title="Publish branch">
            <RowBlock>
              <CloudUploadOutlined />
            </RowBlock>
          </Tooltip>
        </Branch>
      </Row>
    </Spin>
  );
};

const DiffPull: React.FC = () => {
  const value = useStore(model.$diffPull);

  return (
    <Tooltip title="Pull commits">
      <RowBlock>
        <ArrowDownOutlined />
        <span>{value}</span>
      </RowBlock>
    </Tooltip>
  );
};

const DiffPush: React.FC = () => {
  const value = useStore(model.$diffPush);

  return (
    <Tooltip title="Push commits">
      <RowBlock>
        <ArrowUpOutlined />
        <span>{value}</span>
      </RowBlock>
    </Tooltip>
  );
};

const RowBlock = styled(RowBase)`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
