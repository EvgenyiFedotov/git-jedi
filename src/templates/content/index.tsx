import * as React from "react";
import styled from "styled-components";
import { Tabs } from "antd";
import { useStore } from "effector-react";

import { heightLine, padding } from "ui/css";
import { Log } from "features/log";
import { EditRebaseTodo } from "features/edit-rebase-todo";
import { Column } from "ui";
import { EditCommitMessage } from "features/edit-commit-message";

import { $tab } from "./model";

export const Content: React.FC = () => {
  const tab = useStore($tab);
  return (
    <Container>
      <Tabs activeKey={tab} renderTabBar={() => <></>}>
        <Tabs.TabPane key="log">
          <ContainerTab>
            <Log />
          </ContainerTab>
        </Tabs.TabPane>
        <Tabs.TabPane key="edit-rebase-todo">
          <ContainerTab>
            <EditRebaseTodo />
          </ContainerTab>
        </Tabs.TabPane>
        <Tabs.TabPane key="edit-commit-message">
          <ContainerTab>
            <EditCommitMessage />
          </ContainerTab>
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

const Container = styled(Column)`
  height: 100%;
  padding: calc(${heightLine}px + ${padding * 3}px) ${padding}px;
`;

const ContainerTab = styled.div`
  margin-top: 8px;
`;
