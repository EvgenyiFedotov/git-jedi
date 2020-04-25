import * as React from "react";
import { useMount } from "lib/effector-extensions/react/use-mount";
import { useStore } from "effector-react";
import { FullCenterFlex } from "ui";
import { Button } from "antd";

import * as model from "../../model";

export const Settings: React.FC = ({ children }) => {
  useMount(model.init);

  return (
    <StatusReading>
      <CheckWorkDir>{children}</CheckWorkDir>
    </StatusReading>
  );
};

const StatusReading: React.FC = ({ children }) => {
  const status = useStore(model.$statusReading);

  if (status === "done") {
    return <>{children}</>;
  }

  return <FullCenterFlex>Reading settings...</FullCenterFlex>;
};

const CheckWorkDir: React.FC = ({ children }) => {
  const wordDir = useStore(model.$workDir);

  if (wordDir) {
    return <>{children}</>;
  }

  return (
    <FullCenterFlex>
      <Button type="primary" onClick={() => model.openDialogSelectWorkDir()}>
        Select path repo
      </Button>
    </FullCenterFlex>
  );
};
