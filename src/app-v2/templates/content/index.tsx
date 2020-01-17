import * as React from "react";
import styled from "styled-components";
import { heightLine, padding } from "../../ui/css";

export const Content: React.FC = () => <Container>Content</Container>;

const Container = styled.div`
  height: 100%;
  height: 10000px;
  padding: calc(${heightLine}px + ${padding * 2}px) ${padding}px;
  padding-top: calc(${heightLine}px + ${padding * 2}px);
`;
