import { useStore } from "effector-react";
import * as React from "react";

import * as model from "../../model";

// Contracts
export const isExistWorkDir = () => Boolean(useStore(model.$workDir));

export const btnSetupWorkDirClicked = () => model.runShowSelectPathDialog();

export const setupWorkDirUnmounted = () => {
  React.useEffect(() => {
    return () => {
      model.runWriteSettings();
    };
  }, []);
};
