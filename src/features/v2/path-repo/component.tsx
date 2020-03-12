import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import { LinkBlock } from "ui";

import { $pathRepo, selectPathRepo } from "./model";

export const PathRepo: React.FC = () => {
  const pathRepo = useStore($pathRepo);

  const click = React.useCallback(() => selectPathRepo(), []);

  return <Container onClick={click}>{pathRepo}</Container>;
};

const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
