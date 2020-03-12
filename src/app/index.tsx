import * as React from "react";
import { GlobalStyle } from "./global-style";
import styled from "styled-components";
import { Row } from "antd";

// import { Settings } from "features/v2/settings";
import { Init } from "features/v2/init";
import { Header } from "templates/v2/header";
import { Footer } from "templates/v2/footer";
import { Content } from "templates/v2/content";
import { DrawerBranchList } from "features/v2/drawer-branch-list";

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Init>
          <Header />
          <Content />
          <Footer />
          <DrawerBranchList />
        </Init>
      </Container>
    </>
  );
};

export const Container = styled(Row)`
  display: flex;
  flex: none;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
