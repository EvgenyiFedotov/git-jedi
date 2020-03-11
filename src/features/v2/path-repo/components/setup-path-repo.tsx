import * as React from "react";
import { Button } from "antd";
import mousetrap from "mousetrap";

import { selectPathRepo } from "../model";

export const SetupPathRepo: React.FC = () => {
  const click = React.useCallback(() => selectPathRepo(), []);

  React.useEffect(() => {
    mousetrap.bind("enter", () => selectPathRepo());

    return () => {
      mousetrap.unbind("enter");
    };
  });

  return (
    <Button type="primary" onClick={click}>
      Select path repo
    </Button>
  );
};
