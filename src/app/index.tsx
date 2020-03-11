import * as React from "react";
import { GlobalStyle } from "./global-style";
import styled from "styled-components";
import { Row } from "antd";

import { Settings } from "features/v2/settings";
import { Header } from "templates/v2/header";
import { Footer } from "templates/v2/footer";
import { Content } from "templates/v2/content";

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Settings>
          <Header />
          <Content />
          <Footer />
        </Settings>
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
