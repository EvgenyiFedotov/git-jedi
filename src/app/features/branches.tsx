import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as ui from "../ui";
import { $branches, changeBranch } from "../model-v2";
import { showBranches } from "../state";

export const Branches: React.FC = () => {
  const branches = useStore($branches);

  const click = (nameBranch: string) => () => {
    changeBranch(nameBranch);
    showBranches(false);
  };

  return (
    <BranchesContainer>
      {Array.from(branches.values()).map(branch => (
        <Branch key={branch.name} onClick={click(branch.shortName)}>
          {branch.shortName}
        </Branch>
      ))}
    </BranchesContainer>
  );
};

const BranchesContainer = styled.div`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-top: 1px solid var(--panel-boder-color);
  max-height: 10rem;
  overflow-y: auto;
`;

const Branch = styled(ui.ListRow)``;
