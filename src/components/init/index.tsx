import * as React from "react";
import { Spin } from "antd";
import { useStore } from "effector-react";
import { settings } from "model";
import { FullCenterFlex } from "ui";

export const Init: React.FC = ({ children }) => {
  const status = useStore(settings.$statusReadSettings);

  React.useEffect(() => {
    settings.initSettings();
  }, []);

  if (status === null || status === "pending") {
    return (
      <FullCenterFlex>
        <Spin />
      </FullCenterFlex>
    );
  }

  if (status === "fail") {
    return <div>Error read settings</div>;
  }

  return <>{children}</>;
};
