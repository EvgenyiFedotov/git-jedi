import * as React from "react";
import { useStore } from "effector-react";
import { Spin, Drawer } from "antd";
import * as ef from "effector";
import { createVisible } from "lib/effector-extensions/core/visible";

import { $currentBranch, runCurrentBranchName } from "../../model";
import { BranchList } from "../branch-list";
import { Name } from "./ui";

const mount = ef.createEvent();

const visibleList = createVisible();

ef.forward({ from: mount, to: runCurrentBranchName });

export const CurrentBranch: React.FC = () => {
  const value = useStore($currentBranch);

  React.useEffect(() => {
    mount();
  }, []);

  if (value) {
    return (
      <>
        <Name onClick={() => visibleList.show()}>{value}</Name>
        <List />
      </>
    );
  }

  return <Spin size="small" />;
};

const List: React.FC = () => {
  const visible = useStore(visibleList.$value);

  if (visible) {
    return (
      <Drawer
        closable={false}
        visible={visible}
        onClose={() => visibleList.hide()}
        placement="right"
        width="460px"
      >
        <BranchList />
      </Drawer>
    );
  }

  return null;
};
