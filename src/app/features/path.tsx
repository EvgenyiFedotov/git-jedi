import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as gitApi from "../../lib/git-api";
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
    <PathContainer>
      <div>Path:</div>

      <PathValue onClick={selectPath}>{path}</PathValue>
    </PathContainer>
  );
};

const PathContainer = styled(ui.Panel)`
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const PathValue = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
