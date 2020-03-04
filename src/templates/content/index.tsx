import * as React from "react";
import styled from "styled-components";
import { Column } from "ui";

export const Content: React.FC = () => {
  return <Container>Content</Container>;
};

const Container = styled(Column)`
  height: 100%;
`;

const ContainerTab = styled.div`
  margin-top: 8px;
`;
