import * as React from "react";
import { useStore } from "effector-react";
import { List, Tag } from "antd";
import {
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { blue } from "@ant-design/colors";
import { Branch as BranchRender } from "lib/branch";
import { Row } from "ui";

import {
  getBranchList,
  $branchList,
  Branch,
  removeBranchByBranch,
  publishBranchByBranch,
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
  // const checkout = React.useCallback(() => {}, [branch]);

  // const remove = React.useCallback(() => {
  //   removeBranchByBranch(branch);
  // }, [branch]);

  // const publish = React.useCallback(() => {
  //   publishBranchByBranch(branch);
  // }, [branch]);

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

        {/* <Row>
          <BranchRender if={branch.isRemote}>
            <>
              <CloudDownloadOutlined />
            </>
            <BranchRender if={!!branch.remoteName}>
              <>
                <div>
                  <ArrowDownOutlined />
                  <span>{5}</span>
                </div>
                <div>
                  <ArrowUpOutlined />
                  <span>{1}</span>
                </div>
              </>
              <>
                <div>
                  <CloudUploadOutlined onClick={publish} />
                  <span>{8}</span>
                </div>
              </>
            </BranchRender>
          </BranchRender>
          <RemoveButton onClick={remove} />
        </Row> */}
      </ItemRow>
    </ListItem>
  );
};

const RemoveButton = styled(DeleteOutlined)``;

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
