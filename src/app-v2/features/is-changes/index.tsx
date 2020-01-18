import * as React from "react";
import { useStore } from "effector-react";
import { Typography, Button, Badge, Drawer, List, Divider } from "antd";
import { blue, cyan } from "@ant-design/colors";
import styled from "styled-components";

import { Branch } from "../../managers/branch";
import { StatusFile, StatusPath } from "../../../lib/api-git";
import { Row } from "../../ui";
import { $isShowStatus, showStatus } from "../../state";
import {
  $isChanged,
  $status,
  $stageChanges,
  $changes,
  $discarding,
  discardChanges,
  stageChanges,
  unstageChanges
} from "../../../lib/effector-git";

const { Text } = Typography;

export const IsChanges = () => {
  const isChanged = useStore($isChanged);
  const status = useStore($status);
  const isShowStatus = useStore($isShowStatus);
  return (
    <div>
      <Branch if={isChanged}>
        <Badge count={status.length} style={{ backgroundColor: blue.primary }}>
          <Button
            size="small"
            color="blue"
            onClick={() => showStatus(!isShowStatus)}
          >
            Changed
          </Button>
        </Badge>

        <Text>Not changed</Text>
      </Branch>

      <StateRepo />
    </div>
  );
};

const StateRepo: React.FC = () => {
  const stageChanges = useStore($stageChanges);
  const changes = useStore($changes);
  const isShowStatus = useStore($isShowStatus);
  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={() => showStatus(false)}
      visible={isShowStatus}
      width="60%"
    >
      <Branch if={!!stageChanges.length}>
        <ListChanges mode="stageChanges" status={stageChanges} />
      </Branch>

      <ListChanges mode="changes" status={changes} />
    </Drawer>
  );
};

interface ListChangesProps {
  status: StatusPath[];
  mode: "stageChanges" | "changes";
}

const ListChanges: React.FC<ListChangesProps> = props => {
  const { status, mode } = props;
  return (
    <>
      <ListChangesDivider orientation="left">Changes</ListChangesDivider>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={status}
        renderItem={item => <Item mode={mode} item={item} />}
      />
    </>
  );
};

const ListChangesDivider = styled(Divider)`
  position: sticky;
  background-color: white;
  z-index: 100;
`;

interface ItemProps {
  item: StatusPath;
  mode: "stageChanges" | "changes";
}

const Item: React.FC<ItemProps> = props => {
  const { item, mode } = props;
  const discarding = useStore($discarding);
  const status = mode === "stageChanges" ? item.stagedStatus : item.status;
  const actions =
    mode === "stageChanges"
      ? [
          <Button
            key="discard"
            type="link"
            onClick={() => unstageChanges(item.path)}
          >
            unstage
          </Button>
        ]
      : [
          <Button
            key="discard"
            type="link"
            onClick={() => discardChanges(item.path)}
            loading={discarding.has(item.path)}
          >
            discard
          </Button>,
          <Button
            key="stage"
            type="link"
            disabled={discarding.has(item.path)}
            onClick={() => stageChanges(item.path)}
          >
            stage
          </Button>
        ];
  return (
    <ItemContainer actions={actions}>
      <Row>
        <Status value={status}>{status}</Status>
        <div>{item.path}</div>
      </Row>
    </ItemContainer>
  );
};

const ItemContainer = styled(List.Item)`
  display: flex;
  justify-content: space-between;
`;

interface StatusProps {
  value: StatusFile;
}

const Status = styled.div<StatusProps>`
  text-transform: capitalize;
  color: ${({ value: statusFile }) => {
    switch (statusFile) {
      case "untracked":
        return cyan.primary;
      default:
        return blue.primary;
    }
  }};
`;
