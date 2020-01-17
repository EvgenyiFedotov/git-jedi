import * as React from "react";
import { Button, Typography } from "antd";
import { useStore } from "effector-react";
import * as electron from "electron";

import { $path, changePath } from "../../model";

const { Text } = Typography;
const { dialog } = electron.remote;

const selectPath = () =>
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
      defaultPath: $path.getState()
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
  const path = useStore($path);
  return (
    <div>
      <Text>Path:</Text>
      <Button type="link" size="small" onClick={selectPath}>
        {path}
      </Button>
    </div>
  );
};
