import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as gitApi from "../../lib/git-api";
import * as ui from "../ui";
import { $showedBranches, showBranches } from "../model";

export const InputMessage: React.FC = () => {
  const showedBranches = useStore($showedBranches);

  return (
    <InputMessageContainer>
      <CurrentBranch onClick={() => showBranches(!showedBranches)}>
        {gitApi.core.revParse.getCurrentBranch()}
      </CurrentBranch>

      <ui.Input />

      <ui.Button onClick={() => {}}>Send</ui.Button>
    </InputMessageContainer>
  );
};

const InputMessageContainer = styled(ui.Panel)`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const CurrentBranch = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
