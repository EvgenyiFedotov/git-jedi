import * as React from "react";
import { BranchList } from "features/v2/branch-list/component";
import { Drawer } from "antd";
import { useStore } from "effector-react";

import { $showBranchList, closeBranchList } from "./model";

export const DrawerBranchList: React.FC = () => {
  const showBranchList = useStore($showBranchList);

  return (
    <Drawer
      title="Branch list"
      closable={false}
      visible={showBranchList}
      onClose={() => closeBranchList()}
      placement="right"
      width="460px"
    >
      <BranchList />
    </Drawer>
  );
};
