import "features/v2/commands";
import * as React from "react";
import { loadBranches } from "features/v2/branches";

export const InitContainer: React.FC = ({ children }) => {
  React.useEffect(() => {
    loadBranches();
  }, []);

  return <>{children}</>;
};
