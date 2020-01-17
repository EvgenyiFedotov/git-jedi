import * as React from "react";
import { useStore } from "effector-react";
import { Typography, Button, Badge, Drawer, List, Divider } from "antd";
import { blue, cyan } from "@ant-design/colors";
import styled from "styled-components";

import { Branch } from "../../managers/branch";
import {
  $isChanged,
  $status,
  $stageChanges,
  $changes,
  $discarding,
  discardChanges
} from "../../model";
import { StatusFile, StatusPath } from "../../../lib/api-git/core";
import { Row } from "../../ui";
import { $isShowStatus, showStatus } from "../../state";

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
      title="State repo"
      placement="right"
      closable={false}
      onClose={() => showStatus(false)}
      visible={isShowStatus}
      width="60%"
    >
      <Branch if={!!stageChanges.length}>
        <ListChanges status={stageChanges} />
      </Branch>

      <ListChanges status={changes} />
    </Drawer>
  );
};

interface ListChangesProps {
  status: StatusPath[];
}

const ListChanges: React.FC<ListChangesProps> = props => {
  const { status } = props;
  return (
    <>
      <ListChangesDivider orientation="left">Changes</ListChangesDivider>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={status}
        renderItem={item => <Item item={item} />}
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
}

const Item: React.FC<ItemProps> = props => {
  const { item } = props;
  const discarding = useStore($discarding);
  return (
    <ItemContainer
      actions={[
        <Button
          key="discard"
          type="link"
          onClick={() => discardChanges(item.path)}
          loading={discarding.has(item.path)}
        >
          discard
        </Button>,
        <Button key="stage" type="link" disabled={discarding.has(item.path)}>
          stage
        </Button>
      ]}
    >
      <Row>
        <Status value={item.status}>{item.status}</Status>
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
