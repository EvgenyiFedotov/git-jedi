import * as React from "react";
import { $branches, Branch } from "features/v2/branches/model";
import { Row } from "ui";
import { List, Tag } from "antd";
import { useStore } from "effector-react";
import { Branch as BranchRender } from "lib/branch";
import { ListItem } from "ui/antd";

import * as model from "./model";

export const BranchList: React.FC = () => {
  const { ref: branches } = useStore($branches);

  const list = Array.from(branches.values()).map((branch) => (
    <Branch key={branch.refName} branch={branch} />
  ));

  return <List size="small">{list}</List>;
};

const Branch: React.FC<{ branch: Branch }> = ({ branch }) => {
  const click = React.useCallback(() => {
    const nameArr = branch.name.split("/");

    // TODO check list remotes
    if (nameArr[0] === "origin" && !branch.remoteName) {
      const [_, ...name] = nameArr;

      model.changeBranch({ branch: name.join("/") });
    } else {
      model.changeBranch({ branch: branch.name });
    }
  }, [branch]);

  return (
    <ListItem onClick={click}>
      <Row>
        <Row>
          <BranchRender if={branch.head}>
            <b>{branch.name}</b>
            <div>{branch.name}</div>
          </BranchRender>
          <BranchRender if={!!branch.remoteName}>
            <Tag color="blue">{branch.remoteName}</Tag>
          </BranchRender>
        </Row>
      </Row>
    </ListItem>
  );
};
