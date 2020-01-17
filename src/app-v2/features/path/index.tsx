import * as React from "react";
import { Button, Typography } from "antd";
import { useStore } from "effector-react";
import * as electron from "electron";

import { changePath, $cwd } from "../../../lib/effector-git";

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
    <div>
      <Text>Path:</Text>
      <Button type="link" size="small" onClick={selectPath}>
        {cwd}
      </Button>
    </div>
  );
};
