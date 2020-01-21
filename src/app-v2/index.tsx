import * as React from "react";
import { GlobalStyle } from "./global-style";
import styled from "styled-components";
import { Row, Tag } from "antd";

import { Header } from "./templates/header";
import { Content } from "./templates/content";
import { Footer } from "./templates/footer";

export const App = () => {
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
