import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";

import { GlobalStyle } from "./global-style";
import * as ui from "./ui";
import * as managers from "./managers";
import * as features from "./features";

import { $showedBranches } from "./model";

export const App = () => {
  const showedBranches = useStore($showedBranches);

  return (
    <>
      <GlobalStyle />

      <Container>
        <TopContent>
          <Top>
            <features.Path />
          </Top>

          <Content>
            <features.Log />
          </Content>
        </TopContent>

        <Bottom>
          <managers.Branch if={showedBranches}>
            <features.Branches />
          </managers.Branch>

          <features.InputMessage />
          <features.Exec />
        </Bottom>
      </Container>
    </>
  );
};

const Container = styled(ui.Column)`
  height: 100%;
  position: relative;
  justify-content: space-between;
`;

const GridBlock = styled.div`
  width: 100%;
  background-color: var(--bg-color);
  position: sticky;
`;

const Top = styled(GridBlock)`
  top: 0;
`;

const Content = styled.div`
  /* width: 100vh; */
`;

const TopContent = styled.div`
  position: relative;
`;

const Bottom = styled(GridBlock)`
  bottom: 0;
`;
