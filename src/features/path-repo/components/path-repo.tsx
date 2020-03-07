import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import { selectCwd } from "features/settings";
import { LinkBlock } from "ui";

import { $pathRepo } from "../model";

export const PathRepo: React.FC = () => {
  const pathRepo = useStore($pathRepo);

  const click = React.useCallback(() => selectCwd(), []);

  return <Container onClick={click}>{pathRepo}</Container>;
};

const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
