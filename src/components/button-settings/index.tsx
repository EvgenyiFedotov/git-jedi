import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import { Drawer } from "antd";
import { createVisible } from "lib/added-effector/visible";
import { SettingOutlined } from "@ant-design/icons";
import { Settings } from "components/settings";

export const visibleSettings = createVisible();

export const ButtonSettings: React.FC = () => {
  return (
    <Container>
      <SettingOutlined onClick={() => visibleSettings.show()} />
      <DrawerSettings />
    </Container>
  );
};

const DrawerSettings: React.FC = () => {
  const visible = useStore(visibleSettings.$value);

  return (
    <Drawer
      title="Settings"
      placement="right"
      width="460px"
      closable={false}
      visible={visible}
      onClose={() => visibleSettings.hide()}
    >
      <Settings />
    </Drawer>
  );
};

const Container = styled.div`
  cursor: pointer;
`;
