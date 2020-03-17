import * as React from "react";
import { Drawer } from "antd";
import { Column } from "ui";
import { useStore } from "effector-react";
import { UnstagedStatus } from "features/v2/unstaged-status";
import { StagedStatus } from "features/v2/staged-status";
import styled from "styled-components";

import { $showStatus, closeStatus } from "./model";

import { $diff } from "features/v2/diff/model";
import { DiffFile } from "features/v2/diff-file/component";

export const DrawerStatus: React.FC = () => {
  const showStatus = useStore($showStatus);

  return (
    <Drwr
      title="Changes"
      closable={false}
      visible={showStatus}
      onClose={() => closeStatus()}
      placement="right"
      width="460px"
    >
      <Column>
        <UnstagedStatus />
        <StagedStatus />
        <DIFF />
      </Column>
    </Drwr>
  );
};

const Drwr = styled(Drawer)`
  max-width: 100%;

  .ant-drawer-content-wrapper {
    max-width: 100%;
  }
`;

const DIFF: React.FC = () => {
  const diff = useStore($diff);

  return (
    <>
      {Array.from(diff.ref.values()).map((diffFile) => {
        return (
          <Column key={diffFile.path}>
            <div>{diffFile.path}</div>
            <DiffFile diffFile={diffFile} />
          </Column>
        );
      })}
    </>
  );
};
