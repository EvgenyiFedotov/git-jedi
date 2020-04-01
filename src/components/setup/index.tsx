import * as React from "react";
import { useStore } from "effector-react";
import { settings } from "model";
import { FullCenterFlex } from "ui";
import mousetrap from "mousetrap";
import { Button } from "antd";

export const Setup: React.FC = ({ children }) => {
  const cwd = useStore(settings.$cwd);

  if (!cwd) {
    return (
      <FullCenterFlex>
        <SetupPathRepo />
      </FullCenterFlex>
    );
  }

  return <>{children}</>;
};

const SetupPathRepo: React.FC = () => {
  const click = React.useCallback(() => settings.selectCwd(), []);

  React.useEffect(() => {
    mousetrap.bind("enter", () => settings.selectCwd());

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
