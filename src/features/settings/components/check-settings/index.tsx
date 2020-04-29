import * as React from "react";
import { Button } from "antd";
import { FullCenterFlex } from "ui";

import * as contract from "./contract";

export const CheckSettings: React.FC = ({ children }) => {
  const isExistWorkDir = contract.isExistWorkDir();

  if (isExistWorkDir) {
    return <>{children}</>;
  }

  return <SetupWorkDir />;
};

const SetupWorkDir: React.FC = () => {
  contract.setupWorkDirUnmounted();

  return (
    <FullCenterFlex>
      <Button type="primary" onClick={contract.btnSetupWorkDirClicked}>
        Setup work directory
      </Button>
    </FullCenterFlex>
  );
};
