import * as React from "react";
import { List, Tag } from "antd";
import { useStore } from "effector-react";
import { Branch } from "features/commands";
import { Row } from "ui";
import * as ef from "effector";

import { $branches, runBranchList, runCheckoutTo } from "../../model";
import { ListItem } from "./ui";

const mount = ef.createEvent();

ef.forward({ from: mount, to: runBranchList });

export const BranchList: React.FC = () => {
  const branches = useStore($branches).values();

  React.useEffect(() => {
    mount();
  }, []);

  const list = Array.from(branches).map((branch) => (
    <Item key={branch.refName} branch={branch} />
  ));

  return <List size="small">{list}</List>;
};

const Item: React.FC<{ branch: Branch }> = ({ branch }) => {
  return (
    <ListItem onClick={() => runCheckoutTo({ branch })}>
      <Row>
        <Name branch={branch} />
        <Remote branch={branch} />
      </Row>
    </ListItem>
  );
};

const Name: React.FC<{ branch: Branch }> = ({ branch }) => {
  return branch.head === "*" ? <b>{branch.name}</b> : <div>{branch.name}</div>;
};

const Remote: React.FC<{ branch: Branch }> = ({ branch }) => {
  const { remoteName, remote } = branch;
  const colorTag = React.useMemo(() => {
    if (remote) {
      return "blue";
    }
  }, [remote]);

  if (remoteName) {
    return <Tag color={colorTag}>{remoteName}</Tag>;
  }

  return null;
};
