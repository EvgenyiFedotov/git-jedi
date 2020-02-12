import * as React from "react";
import { useStore } from "effector-react";
import { Select, Tag, Icon as IconAntd, Button, Table } from "antd";
import { blue } from "@ant-design/colors";
import styled from "styled-components";
import {
  $contentRebaseTodoFormatted,
  RowContentRabaseTodo,
  abortRebase,
  rebaseRowMoveUp,
  rebaseRowMoveDown,
  changeActionRowRebaseTodoFormatted,
  saveContentRebaseTodo,
} from "features/state-git";
import { Row, Column } from "ui";
import { Branch } from "lib/branch";
import { MessageFormatted } from "lib/api-git-v2";

const columns = [
  {
    dataIndex: "action",
    key: "action",
    render: (_: any, row: RowContentRabaseTodo) => <Action row={row} />,
  },
  {
    dataIndex: "shortHash",
    key: "shortHash",
    render: (shortHash: string) => <a>{shortHash}</a>,
  },
  {
    dataIndex: "message",
    key: "type",
    render: (message: MessageFormatted) => (
      <Tag color={blue.primary}>{message.type}</Tag>
    ),
  },
  {
    dataIndex: "message",
    key: "note",
    render: (message: MessageFormatted) => <div>{message.note}</div>,
  },
  {
    dataIndex: "message",
    key: "actions",
    render: (_: any, row: RowContentRabaseTodo) => (
      <Row>
        <Branch if={!row.isLast}>
          <Icon type="down" onClick={() => rebaseRowMoveDown(row)} />
        </Branch>
        <Branch if={!row.isFirst}>
          <Icon type="up" onClick={() => rebaseRowMoveUp(row)} />
        </Branch>
      </Row>
    ),
  },
];

export const EditRebaseTodo: React.FC = () => {
  const { ref: contentRebaseTodo } = useStore($contentRebaseTodoFormatted);

  return (
    <Column>
      <Table
        showHeader={false}
        size="middle"
        pagination={false}
        columns={columns}
        dataSource={contentRebaseTodo}
        rowKey={(row: RowContentRabaseTodo) => row.shortHash}
      />
      <Button onClick={() => abortRebase()}>Abort</Button>
      <Button type="primary" onClick={() => saveContentRebaseTodo()}>
        Next
      </Button>
    </Column>
  );
};

const Icon = styled(IconAntd)`
  color: ${blue.primary};
  cursor: pointer;
`;

const Action: React.FC<{ row: RowContentRabaseTodo }> = ({ row }) => {
  const { action } = row;

  return (
    <Select
      value={action}
      size="small"
      style={{ minWidth: "72px" }}
      onChange={(value: string) =>
        changeActionRowRebaseTodoFormatted({ row, value })
      }
    >
      <Select.Option value="pick">pick</Select.Option>
      <Select.Option value="reword">reword</Select.Option>
      <Select.Option value="squash">squash</Select.Option>
    </Select>
  );
};
