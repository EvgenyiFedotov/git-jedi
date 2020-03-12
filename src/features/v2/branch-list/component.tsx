import * as React from "react";
import { $branches, Branch } from "features/v2/branches";
import styled from "styled-components";
import { Row } from "ui";
import { List, Tag } from "antd";
import { blue } from "@ant-design/colors";
import { useStore } from "effector-react";
import { Branch as BranchRender } from "lib/branch";

export const BranchList: React.FC = () => {
  const { ref: branches } = useStore($branches);

  const list = Array.from(branches.values()).map((branch) => (
    <Branch key={branch.refName} branch={branch} />
  ));

  return <List size="small">{list}</List>;
};

const Branch: React.FC<{ branch: Branch }> = ({ branch }) => {
  return (
    <ListItem>
      <ItemRow>
        <Row>
          <BranchRender if={branch.head}>
            <b>{branch.name}</b>
            <div>{branch.name}</div>
          </BranchRender>
          <BranchRender if={!branch.isRemote && !!branch.remoteName}>
            <Tag color="blue">{branch.remoteName}</Tag>
          </BranchRender>
        </Row>
      </ItemRow>
    </ListItem>
  );
};

const ListItem = styled(List.Item)`
  cursor: pointer;

  &:hover {
    background-color: ${blue[0]};
  }
`;
const ItemRow = styled(Row)`
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
`;
