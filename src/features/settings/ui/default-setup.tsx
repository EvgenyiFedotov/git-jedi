import * as React from "react";
import styled from "styled-components";
import { Button } from "antd";
import mousetrap from "mousetrap";

import { selectCwd } from "../model";

export const DefaultSetup: React.FC = () => {
  const click = React.useCallback(() => {
    selectCwd();
  }, []);

  React.useEffect(() => {
    mousetrap.bind("enter", () => selectCwd());

    return () => {
      mousetrap.unbind("enter");
    };
  });

  return (
    <Container>
      <Button type="primary" onClick={click}>
        Select path repo
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
