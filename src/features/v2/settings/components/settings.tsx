import * as React from "react";
import { useStore } from "effector-react";
import { Spin } from "antd";

import { init, $pendingReadSettings } from "../model";

export const Settings: React.FC = ({ children }) => {
  const pendingReadSettings = useStore($pendingReadSettings);

  React.useEffect(() => init(), []);

  if (pendingReadSettings !== false) {
    return <Spin />;
  }

  return <>{children}</>;
};
