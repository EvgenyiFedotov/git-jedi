import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as ui from "../ui";
import { $showedBranches, showBranches, $currentBranch } from "../model";

export const InputMessage: React.FC = () => {
  const showedBranches = useStore($showedBranches);
  const currentBranch = useStore($currentBranch);

  return (
    <InputMessageContainer>
      <ui.ButtonLink onClick={() => showBranches(!showedBranches)}>
        {currentBranch}
      </ui.ButtonLink>

      <ui.Input />

      <ui.Button onClick={() => {}}>Send</ui.Button>
    </InputMessageContainer>
  );
};

const InputMessageContainer = styled(ui.Panel)`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-top: 1px solid var(--panel-boder-color);
`;
