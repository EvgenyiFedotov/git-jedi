import * as React from "react";
import { useStore } from "effector-react";

import { openDialog, $path } from "./model";

export const Path: React.FC = () => {
  const path = useStore($path);

  return (
    <a type="link" onClick={() => openDialog()}>
      {path}
    </a>
  );
};
