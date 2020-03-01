import * as React from "react";
import { Input } from "antd";
import styled from "styled-components";
import { Branch } from "lib/branch";
import { useStore } from "effector-react";
import { useFindElement } from "lib/use-find-element";
import mousetrap from "mousetrap";

import {
  $visible,
  changeVisible,
  addRemoteUrl,
  changeRemoteUrl,
  $remoteUrl,
} from "../model";

export const RemoteAdd: React.FC = () => {
  const visible = useStore($visible);
  const remoteUrl = useStore($remoteUrl);

  const { ref } = useFindElement((element) => {
    const instanceMousetrap = mousetrap(element);

    instanceMousetrap.bind("command+enter", () => addRemoteUrl());
    instanceMousetrap.bind("esc", () => changeVisible.hide());

    return () => {
      instanceMousetrap.unbind("command+enter");
      instanceMousetrap.unbind("esc");
    };
  });

  const change = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      changeRemoteUrl(event.currentTarget.value);
    },
    [],
  );

  return (
    <Branch if={visible}>
      <Container>
        <Popover>
          <Input
            placeholder="remote url"
            autoFocus={true}
            ref={ref}
            value={remoteUrl}
            onChange={change}
          />
        </Popover>
      </Container>
    </Branch>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.65);
`;

const Popover = styled.div`
  min-width: 80%;
  max-width: 80%;
  max-height: 80%;
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-radius: 4px;
`;
