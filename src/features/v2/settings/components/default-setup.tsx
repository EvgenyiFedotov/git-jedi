import * as React from "react";
import styled from "styled-components";
import { SetupPathRepo } from "features/v2/path-repo";

export const DefaultSetup: React.FC = () => {
  return (
    <Container>
      <SetupPathRepo />
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
