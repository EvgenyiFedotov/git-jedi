import "./model/init";

import * as React from "react";
import { RowBase } from "ui";
import { Settings, WordDir, SettingsButton } from "features/settings";
import { CurrentBranch } from "features/branches";
import { Divider } from "antd";

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
        <Divider type="vertical" />
        <CurrentBranch />
      </RowBase>

      <RowBase>
        <SettingsButton />
      </RowBase>
    </FooterContainer>
  );
};
