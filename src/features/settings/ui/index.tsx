import * as React from "react";
import { useStore } from "effector-react";

import { init, $cwd } from "../model";
import { DefaultSetup } from "./default-setup";

export const Settings: React.FC = ({ children }) => {
  const cwd = useStore($cwd);

  React.useEffect(() => init(), []);

  if (!cwd) {
    return <DefaultSetup />;
  }

  return <>{children}</>;
};
