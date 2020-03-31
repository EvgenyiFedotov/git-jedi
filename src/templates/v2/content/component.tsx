import * as React from "react";
import styled from "styled-components";
import { Column, RowPadding } from "ui";
import { UnstagedStatus } from "features/v2/unstaged-status/component";
import { StagedStatus } from "features/v2/staged-status/component";
import { FormCreateCommit } from "features/v2/form-create-commit/component";

export const Content: React.FC = () => {
  return (
    <Container>
      <UnstagedStatus />
      <StagedStatus />
      <FormBlock>
        <FormCreateCommit />
      </FormBlock>
    </Container>
  );
};

const Container = styled(Column)`
  /* padding: 40px 8px 24px 8px; */
  padding: 8px 0px 24px 0px;
`;

const FormBlock = styled(RowPadding)`
  & > * {
    width: 100%;
  }
`;
