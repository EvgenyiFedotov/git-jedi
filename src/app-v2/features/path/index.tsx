import * as React from "react";
import { Typography } from "antd";
import { useStore } from "effector-react";
import * as electron from "electron";
import styled from "styled-components";

import { changePath, $cwd } from "../../../lib/effector-git";
import { Row } from "../../ui";

const { Text } = Typography;
const { dialog } = electron.remote;

const selectPath = () =>
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
      defaultPath: $cwd.getState()
    })
    .then(result => {
      const {
        canceled,
        filePaths: [nextPath]
      } = result;

      if (canceled === false) {
        changePath(nextPath);
      }
    });

export const Path: React.FC = () => {
  const cwd = useStore($cwd);

  return (
    <Container>
      <Text>Path:</Text>
      <a type="link" onClick={selectPath}>
        {cwd}
      </a>
    </Container>
  );
};

const Container = styled(Row)``;
