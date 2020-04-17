import * as React from "react";
import { Column, RowBase } from "ui";
import { Settings, WordDir, SettingsButton } from "features/settings";

import { AppContainer, Style, ContentContainer, FooterContainer } from "./ui";

export const App: React.FC = () => {
  return (
    <AppContainer>
      <Style />
      <Settings>
        <Content />
        <Footer />
      </Settings>
    </AppContainer>
  );
};

const Content: React.FC = () => {
  return <ContentContainer>123</ContentContainer>;
};

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <RowBase>
        <WordDir />
      </RowBase>

      <RowBase>
        <SettingsButton />
      </RowBase>
    </FooterContainer>
  );
};
