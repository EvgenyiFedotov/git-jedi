import * as React from "react";
import { Drawer } from "antd";
import { useStore } from "effector-react";

import { ConfigList } from "./config-list";
import { $isShowConfig, showHideConfig } from "../model";

export const Config: React.FC = () => {
  const isShowConfig = useStore($isShowConfig);

  return (
    <>
      <Drawer
        placement="bottom"
        visible={isShowConfig}
        closable={false}
        onClose={() => showHideConfig.hide()}
        height="80%"
      >
        <ConfigList />
      </Drawer>
    </>
  );
};
