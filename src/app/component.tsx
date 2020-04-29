import * as React from "react";
import { RowBase } from "ui";

import { Style } from "./global-style";
import { UiApp, UiContent, UiFooter } from "./ui";

export const App: React.FC = () => {
  return (
    <UiApp>
      <Style />
      <Content />
      <Footer />
    </UiApp>
  );
};

const Content: React.FC = () => {
  return <UiContent>123</UiContent>;
};

const Footer: React.FC = () => {
  return (
    <UiFooter>
      <RowBase></RowBase>
      <RowBase></RowBase>
    </UiFooter>
  );
};
