import * as React from "react";
import "features/v2/commands";
import { loadBranches } from "features/v2/branches";
import { $cwd } from "features/v2/settings";
import { useStore } from "effector-react";

import { Setup } from "./setup";

export const Init: React.FC = ({ children }) => {
  const cwd = useStore($cwd);

  React.useEffect(() => {
    loadBranches();
  }, []);

  if (!cwd) {
    return <Setup />;
  }

  return <>{children}</>;
};
