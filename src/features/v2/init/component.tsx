import * as React from "react";
import {
  $cwd,
  initSettings,
  $statusReadSettings,
} from "features/v2/settings/model";
import { useStore } from "effector-react";
import styled from "styled-components";
import { Button, Spin } from "antd";
import mousetrap from "mousetrap";
import { selectPathRepo } from "features/v2/path-repo";
import {} from "features/v2/settings/model";

export const Init: React.FC = ({ children }) => {
  const statusReadSettings = useStore($statusReadSettings);

  React.useEffect(() => initSettings(), []);

  if (statusReadSettings === null || statusReadSettings === "pending") {
    return <Spin />;
  }

  if (statusReadSettings === "fail") {
    return <div>Error read settings</div>;
  }

  return <Setup>{children}</Setup>;
};

const Setup: React.FC = ({ children }) => {
  const cwd = useStore($cwd);

  if (!cwd) {
    return (
      <Container>
        <SetupPathRepo />
      </Container>
    );
  }

  return <AfterSetup>{children}</AfterSetup>;
};

const AfterSetup: React.FC = ({ children }) => {
  return <>{children}</>;
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const SetupPathRepo: React.FC = () => {
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
