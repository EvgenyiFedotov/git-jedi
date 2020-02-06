import * as React from "react";
import { GlobalStyle } from "./global-style";
import styled from "styled-components";
import { Row } from "antd";

import { Header } from "templates/header";
import { Content } from "templates/content";
import { Footer } from "templates/footer";
import { initStateGit } from "features/state-git-v2";

export const App = () => {
  React.useEffect(() => {
    initStateGit();
  });

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header />
        <Content />
        {/* <Footer /> */}
      </Container>
    </>
  );
};

export const Container = styled(Row)`
  display: flex;
  flex: none;
  flex-direction: column;
  width: 100%;
`;
