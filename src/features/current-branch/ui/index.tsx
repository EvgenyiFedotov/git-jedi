import * as React from "react";
import styled from "styled-components";
import { LinkBlock } from "ui";

import { init } from "../model";

export const CurrentBranch: React.FC = () => {
  React.useEffect(() => init(), []);

  return <Container>CurrentBranch</Container>;
};

export const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
