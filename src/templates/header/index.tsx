import * as React from "react";
import styled from "styled-components";
import { Row } from "ui";
import { CommandsInput } from "features/commands";
import { PathRepo } from "features/path-repo";

export const Header: React.FC = () => {
  return (
    <Container>
      <PathRepo />
      <CommandsInput />
    </Container>
  );
};

const Container = styled(Row)`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 40px;
  padding: 8px;
  background-color: white;
  flex-wrap: nowrap;
`;
