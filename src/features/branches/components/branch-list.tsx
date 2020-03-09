import * as React from "react";
import { useStore } from "effector-react";
import { List } from "antd";
import styled from "styled-components";
import { blue } from "@ant-design/colors";
import { Branch as BranchRender } from "lib/branch";

import { getBranchList, $branchList, Branch } from "../model";

export const BranchList: React.FC = () => {
  const branchList = useStore($branchList);

  const list = branchList.map((branch) => (
    <Branch key={branch.refName} branch={branch} />
  ));

  React.useEffect(() => {
    getBranchList();
  }, []);

  return <List>{list}</List>;
};

const Branch: React.FC<{ branch: Branch }> = ({ branch }) => {
  return (
    <ListItem>
      <BranchRender if={branch.head}>
        <b>{branch.name}</b>
        <>{branch.name}</>
      </BranchRender>
    </ListItem>
  );
};

const ListItem = styled(List.Item)`
  &:hover {
    background-color: ${blue[0]};
  }
`;
