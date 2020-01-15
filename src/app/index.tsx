import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";

import { GlobalStyle } from "./global-style";
import * as ui from "./ui";
import * as managers from "./managers";
import * as features from "./features";
import * as tempates from "./templates";

import { $showedBranches } from "./model";
import { pageMount } from "./model-v2";

export const App = () => {
  const showedBranches = useStore($showedBranches);

  React.useEffect(() => pageMount(), []);

  return (
    <>
      <GlobalStyle />

      <Container>
        <TopContent>
          <Top>
            <managers.ReversChildren>
              <tempates.TopToolbar />

              <features.StatusPaths />
            </managers.ReversChildren>
          </Top>

          <Content>
            <features.Log />
          </Content>
        </TopContent>

        <Bottom>
          {/* <features.Refs /> */}

          <managers.Branch if={showedBranches}>
            <features.Branches />
          </managers.Branch>

          <features.InputMessage />
          {/* <features.Exec /> */}
        </Bottom>
      </Container>
    </>
  );
};

const Container = styled(ui.Column)`
  height: 100%;
  position: relative;
  justify-content: space-between;

  & > *:not(:last-child) {
    margin-bottom: 0;
  }
`;

const GridBlock = styled(ui.Column)`
  width: 100%;
  background-color: var(--bg-color);
  position: sticky;

  & > *:not(:last-child) {
    margin: 0;
  }
`;

const Top = styled(GridBlock)`
  top: 0;
  flex-direction: column-reverse;
`;

const Content = styled.div`
  /* width: 100vh; */
  /* overflow-y: auto; */
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  flex: 1 1 0%;
`;

const TopContent = styled(ui.Column)`
  position: relative;
  flex: 1 0;
  height: 100%;
  overflow: hidden;

  & > *:not(:last-child) {
    margin-bottom: 0;
  }
`;

const Bottom = styled(GridBlock)`
  bottom: 0;
`;
