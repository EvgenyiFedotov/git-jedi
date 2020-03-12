import * as React from "react";
import { useStore } from "effector-react";
import styled from "styled-components";

import { $status } from "./model";

export const CountChanges: React.FC = () => {
  const count = useStore($status).length;

  return <CountChangesContainer>changes: {count}</CountChangesContainer>;
};

const CountChangesContainer = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
