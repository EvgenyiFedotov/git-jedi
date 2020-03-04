import * as React from "react";
import { useStore } from "effector-react";

import { init, $settings } from "../model";

export const Settings: React.FC = ({ children }) => {
  const settings = useStore($settings);

  React.useEffect(() => init(), []);

  if (!settings.cwd) {
    return null;
  }

  return <>{children}</>;
};
