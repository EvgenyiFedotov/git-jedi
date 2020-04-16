import * as React from "react";
import { Column, RowBase } from "ui";

export const App: React.FC = () => {
  return (
    <SApp>
      <Content />
      <Footer />
    </SApp>
  );
};

const Content: React.FC = () => {
  return <Column></Column>;
};

const Footer: React.FC = () => {
  return (
    <SFooter>
      <RowBase></RowBase>

      <RowBase></RowBase>
    </SFooter>
  );
};

const SApp = styled.div``;

const SFooter = styled(RowBase)`
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 24px;
  padding: 0 8px;
  background-color: white;
  border-top: 1px solid #f5f5f5;
`;
