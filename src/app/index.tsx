import * as React from "react";
import { GlobalStyle } from "./global-style";
import styled from "styled-components";
import { Row } from "antd";

import { Header } from "templates/header";
import { Content } from "templates/content";
import { Settings } from "features/settings";
import { Footer } from "templates/footer";

import "./model";

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
