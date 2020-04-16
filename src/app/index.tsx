import * as React from "react";
import { Column, RowBase } from "ui";
import { Setting } from "features/settings";

import { AppContainer, Style, FooterContainer } from "./ui";

export const App: React.FC = () => {
  return (
    <AppContainer>
      <Style />
      <Setting>
        <Content />
        <Footer />
      </Setting>
    </AppContainer>
  );
};

const Content: React.FC = () => {
  return <Column>123</Column>;
};

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <RowBase></RowBase>

      <RowBase></RowBase>
    </FooterContainer>
  );
};
