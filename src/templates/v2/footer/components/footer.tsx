import * as React from "react";
import styled from "styled-components";
import { Row } from "ui";
import { PathRepo } from "features/v2/path-repo";

export const Footer: React.FC = () => {
  return (
    <Container>
      <PathRepo />
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
