import * as React from "react";
import styled from "styled-components";
import { Column } from "ui";
import { ChangeBranchInput } from "features/v2/change-branch-input";
import { CreateBranchInput } from "features/v2/create-branch-input";
import { RemoveBranchInput } from "features/v2/remove-branch-input";
import { UnstagedStatus } from "features/v2/unstaged-status/component";
import { StagedStatus } from "features/v2/staged-status/component";
import { FormCreateCommit } from "features/v2/form-create-commit/component";
import { Settings } from "features/v2/settings/component";

export const Content: React.FC = () => {
  return (
    <Container>
      <Settings />
      <ChangeBranchInput />
      <CreateBranchInput />
      <RemoveBranchInput />
      <UnstagedStatus />
      <StagedStatus />
      <FormCreateCommit />
    </Container>
  );
};

const Container = styled(Column)`
  padding: 40px 8px 24px 8px;
`;
