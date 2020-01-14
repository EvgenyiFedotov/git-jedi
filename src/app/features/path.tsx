import * as React from "react";
import { useStore } from "effector-react";
import * as ui from "../ui";
import { $path, changePath } from "../model";
import * as electron from "electron";

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
    <ui.Row>
      <div>Path:</div>

      <ui.ButtonLink onClick={selectPath}>{path}</ui.ButtonLink>
    </ui.Row>
  );
};
