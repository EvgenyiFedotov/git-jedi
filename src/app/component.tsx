import * as React from "react";
import { RowBase } from "ui";
import { CheckSettings, ReadSettings, NameWorkDir } from "features/settings";

import { Style } from "./global-style";
import { UiApp, UiContent, UiFooter } from "./ui";

export const App: React.FC = () => {
  return (
    <UiApp>
      <Style />
      <ReadSettings>
        <CheckSettings>
          <Content />
          <Footer />
        </CheckSettings>
      </ReadSettings>
    </UiApp>
  );
};

const Content: React.FC = () => {
  return <UiContent>123</UiContent>;
};

const Footer: React.FC = () => {
  return (
    <UiFooter>
      <FooterLeft />
      <FooterRight />
    </UiFooter>
  );
};

const FooterLeft: React.FC = () => {
  return (
    <RowBase>
      <NameWorkDir />
    </RowBase>
  );
};

const FooterRight: React.FC = () => {
  return <RowBase></RowBase>;
};
