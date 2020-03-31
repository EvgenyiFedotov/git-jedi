import * as React from "react";
import { SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Drawer } from "antd";
import { Settings } from "features/v2/settings/component";

export const ButtonSettings: React.FC = () => {
  const [visible, setVisible] = React.useState<boolean>(false);

  const show = React.useCallback(() => {
    setVisible(true);
  }, []);

  const hide = React.useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <Container>
      <SettingOutlined onClick={show} />
      <Drawer
        title="Settings"
        placement="right"
        width="460px"
        closable={false}
        visible={visible}
        onClose={hide}
      >
        <Settings />
      </Drawer>
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
`;
