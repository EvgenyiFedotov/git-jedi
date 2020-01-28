import * as React from "react";
import styled from "styled-components";

import { heightLine, padding } from "ui/css";
import { Log } from "../../features/log";

export const Content: React.FC = () => (
  <Container>
    <Log />
  </Container>
);

const Container = styled.div`
  height: 100%;
  padding: calc(${heightLine}px + ${padding * 3}px) ${padding}px;
`;
