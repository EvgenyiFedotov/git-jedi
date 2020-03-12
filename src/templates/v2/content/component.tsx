import * as React from "react";
import styled from "styled-components";
import { Column } from "ui";
import { ChangeBranchInput } from "features/v2/change-branch-input";
import { CreateBranchInput } from "features/v2/create-branch-input";

export const Content: React.FC = () => {
  return (
    <Container>
      <ChangeBranchInput />
      <CreateBranchInput />
    </Container>
  );
};

const Container = styled(Column)`
  height: 100%;
  padding: 40px 8px 24px 8px;
`;
