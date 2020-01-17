import * as React from "react";
import styled from "styled-components";
import { appFixBlock } from "../../ui/css";

export const Header: React.FC = () => <Container>Header</Container>;

const Container = styled.div`
  ${appFixBlock}
  top: 0;
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;