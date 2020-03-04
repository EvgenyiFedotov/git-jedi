import * as React from "react";
import styled from "styled-components";
import { Column } from "ui";

export const Content: React.FC = () => {
  return <Container>Content</Container>;
};

const Container = styled(Column)`
  height: 100%;
  padding: 40px 8px 24px 8px;

  height: 5000px;
`;
