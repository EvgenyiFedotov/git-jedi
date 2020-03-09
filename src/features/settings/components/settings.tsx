import * as React from "react";
import { useStore } from "effector-react";
import { Spin } from "antd";

import { init, $cwd, $readSettings } from "../model";
import { DefaultSetup } from "./default-setup";

export const Settings: React.FC = ({ children }) => {
  const cwd = useStore($cwd);
  const readSettings = useStore($readSettings);

  React.useEffect(() => init(), []);

  if (readSettings !== false) {
    return <Spin />;
  }

  if (!cwd) {
    return <DefaultSetup />;
  }

  return <>{children}</>;
};
