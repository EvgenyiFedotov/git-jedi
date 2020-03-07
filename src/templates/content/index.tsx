import * as React from "react";
import styled from "styled-components";
import { Column } from "ui";
import { CommandsList } from "features/commands";

export const Content: React.FC = () => {
  return (
    <Container>
      <div>Content</div>
      <CommandsList />
    </Container>
  );
};

const Container = styled(Column)`
  height: 100%;
  padding: 40px 8px 24px 8px;

  height: 5000px;
`;
