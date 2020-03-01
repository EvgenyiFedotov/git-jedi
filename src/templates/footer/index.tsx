import * as React from "react";
import styled from "styled-components";
import { appFixBlock } from "ui/css";

import { Input } from "antd";

export const Footer: React.FC = () => (
  <Container>
    <Input size="small" />
  </Container>
);

const Container = styled.div`
  ${appFixBlock}
  bottom: 0;
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;
