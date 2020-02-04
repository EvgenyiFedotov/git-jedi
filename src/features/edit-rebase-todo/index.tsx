import * as React from "react";
import { useStore } from "effector-react";
import { Select, Tag, Icon as IconAntd, Button, Table } from "antd";
import { blue } from "@ant-design/colors";
import styled from "styled-components";

import {
  $contentRebaseTodo,
  RowContentRabaseTodo,
  abortRebase,
  rebaseRowMoveUp,
  rabaseRowMoveDown,
  FormattedCommitMessage,
} from "features/state-git";
import { Row, Column } from "ui";
import { Branch } from "lib/branch";

const columns = [
  {
    dataIndex: "action",
    key: "action",
    render: (action: string) => (
      <Select value={action} size="small" style={{ minWidth: "72px" }}>
        <Select.Option value="pick">pick</Select.Option>
        <Select.Option value="reword">reword</Select.Option>
        <Select.Option value="squash">squash</Select.Option>
      </Select>
    ),
  },
  {
    dataIndex: "shortHash",
    key: "shortHash",
    render: (shortHash: string) => <a>{shortHash}</a>,
  },
  {
    dataIndex: "message",
    key: "type",
    render: (message: FormattedCommitMessage) => (
      <Tag color={blue.primary}>{message.type}</Tag>
    ),
  },
  {
    dataIndex: "message",
    key: "note",
    render: (message: FormattedCommitMessage) => <div>{message.note}</div>,
  },
  {
    dataIndex: "message",
    key: "actions",
    render: (_: any, row: RowContentRabaseTodo) => (
      <Branch if={!row.isFirst && !row.isLast}>
        <Row>
          <Icon type="up" onClick={() => rebaseRowMoveUp(row)} />
          <Icon type="down" onClick={() => rabaseRowMoveDown(row)} />
        </Row>
      </Branch>
    ),
  },
];

export const EditRebaseTodo: React.FC = () => {
  const { ref: contentRebaseTodo } = useStore($contentRebaseTodo);

  return (
    <Column>
      <Button onClick={() => abortRebase()}>Abort rebase</Button>
      <Table
        showHeader={false}
        size="middle"
        pagination={false}
        columns={columns}
        dataSource={contentRebaseTodo}
        rowKey={(row: RowContentRabaseTodo) => row.shortHash}
      />
    </Column>
  );
};

const Icon = styled(IconAntd)`
  color: ${blue.primary};
  cursor: pointer;
`;
