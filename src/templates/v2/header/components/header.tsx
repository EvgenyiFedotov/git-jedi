import * as React from "react";
import styled from "styled-components";
import { Row } from "ui";
import { CommandInput } from "features/v2/command-input";

export const Header: React.FC = () => {
  return (
    <Container>
      <CommandInput />
    </Container>
  );
};

const Container = styled(Row)`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
  width: 100%;
  height: 40px;
  padding: 8px;
  background-color: white;
  flex-wrap: nowrap;
`;
