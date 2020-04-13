import * as React from "react";
import * as antd from "antd";
import { Branch } from "lib/branch";
import { useStore } from "effector-react";
import * as model from "model";
import { ListItem } from "ui/antd";
import { Row } from "ui";

const { $branches, fetchP } = model.branches;
const { changeBranch } = model.changeBranch;

export const BranchList: React.FC = () => {
  const branches = useStore($branches);

  const list = Array.from(branches.values()).map((branch) => (
    <Item key={branch.refName} branch={branch} />
  ));

  return <antd.List size="small">{list}</antd.List>;
};

const Item: React.FC<{ branch: model.branches.Branch }> = ({ branch }) => {
  const colorTag = React.useMemo(() => {
    if (branch.remote) {
      return "blue";
    }
  }, [branch]);

  return (
    <ListItem onClick={() => changeBranch({ branch })}>
      <Row>
        <Row>
          <Branch if={branch.head === "*"}>
            <b>{branch.name}</b>
            <div>{branch.name}</div>
          </Branch>
          <Branch if={!!branch.remoteName}>
            <antd.Tag color={colorTag}>{branch.remoteName}</antd.Tag>
          </Branch>
        </Row>
      </Row>
    </ListItem>
  );
};

export const ButtonFetch: React.FC = () => {
  return (
    <antd.Button size="small" type="primary" onClick={() => fetchP()}>
      Fetch
    </antd.Button>
  );
};
