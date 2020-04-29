import * as React from "react";
import * as ef from "effector";

import { runReadSettings } from "../../model";

// Contracts
export const readSettingsMounted = () => {
  React.useEffect(() => {
    runReadSettings();
  }, []);
};
