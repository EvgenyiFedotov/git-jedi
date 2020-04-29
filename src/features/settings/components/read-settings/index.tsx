import * as React from "react";

import { readSettingsMounted } from "./contract";

export const ReadSettings: React.FC = ({ children }) => {
  readSettingsMounted();

  return <>{children}</>;
};
