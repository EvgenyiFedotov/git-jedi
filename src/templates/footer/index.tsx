import * as React from "react";
import styled from "styled-components";
import { Row } from "ui";
import { CurrentBranch } from "features/current-branch";

export const Footer: React.FC = () => {
  return (
    <Container>
      <CurrentBranch />
    </Container>
  );
};

const Container = styled(Row)`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 24px;
  padding: 8px;
  background-color: white;
  flex-wrap: nowrap;
`;
