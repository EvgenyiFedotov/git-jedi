import * as React from "react";
import styled from "styled-components";
import * as ui from "../ui";
import * as features from "../features";

export const TopToolbar: React.FC = () => {
  return (
    <TopToolbarContainer>
      <ui.Row>
        <features.Path />

        <features.Status />
      </ui.Row>
    </TopToolbarContainer>
  );
};

const TopToolbarContainer = styled(ui.PanelTop)`
  & > ${ui.Row} {
    justify-content: space-between;
    width: 100%;
  }
`;
