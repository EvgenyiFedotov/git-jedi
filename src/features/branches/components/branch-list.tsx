import * as React from "react";
import { useStore } from "effector-react";
import { List, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { blue } from "@ant-design/colors";
import { Branch as BranchRender } from "lib/branch";
import { Row } from "ui";

import {
  getBranchList,
  $branchList,
  Branch,
  removeBranchByBranch,
} from "../model";

export const BranchList: React.FC = () => {
  const { ref: branchList } = useStore($branchList);

  const list = Array.from(branchList.values()).map((branch) => (
    <Branch key={branch.refName} branch={branch} />
  ));

  React.useEffect(() => {
    getBranchList();
  }, []);

  return <List size="small">{list}</List>;
};

const Branch: React.FC<{ branch: Branch }> = ({ branch }) => {
  const checkout = React.useCallback(() => {}, [branch]);

  const remove = React.useCallback(() => {
    removeBranchByBranch(branch);
  }, [branch]);

  return (
    <ListItem>
      <ItemRow onClick={checkout}>
        <Row>
          <BranchRender if={branch.head}>
            <b>{branch.name}</b>
            <div>{branch.name}</div>
          </BranchRender>
          <BranchRender if={!!branch.remote}>
            <Tag color="blue">{branch.remoteName}</Tag>
          </BranchRender>
        </Row>

        <div>
          <RemoveButton onClick={remove} />
        </div>
      </ItemRow>
    </ListItem>
  );
};

const RemoveButton = styled(DeleteOutlined)``;

const ListItem = styled(List.Item)`
  cursor: pointer;

  ${RemoveButton} {
    visibility: hidden;
  }

  &:hover {
    background-color: ${blue[0]};

    ${RemoveButton} {
      visibility: visible;
    }
  }
`;

const ItemRow = styled(Row)`
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
`;
