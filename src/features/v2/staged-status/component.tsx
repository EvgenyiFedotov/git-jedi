import * as React from "react";
import { useStore } from "effector-react";
import { Row, Column, StatusFileAction, ButtonIcon } from "ui";
import { Tooltip } from "antd";
import { toStatusFileAction, toColor } from "lib/status-file-action";
import { MinusOutlined } from "@ant-design/icons";
import { ListItem } from "ui/antd";
import { List } from "antd";
import styled from "styled-components";
import { DiffFile } from "ui/diff-file";

import {
  $stagedStatus,
  StatusFile,
  unstageChanges,
  unstageAllChanges,
  getDiff,
} from "./model";

export const StagedStatus: React.FC = () => {
  const { ref: stagedStatus } = useStore($stagedStatus);

  if (!stagedStatus.size) {
    return null;
  }

  const list = Array.from(stagedStatus.values()).map((statusFile) => (
    <React.Fragment key={statusFile.path}>
      <StatusFile statusFile={statusFile} />
      {statusFile.diff ? (
        <DiffFile diffFile={statusFile.diff} status="stage" />
      ) : null}
    </React.Fragment>
  ));

  return (
    <Column>
      <Header />
      <List size="small">{list}</List>
    </Column>
  );
};

const Header: React.FC = () => {
  const unstage = React.useCallback(() => unstageAllChanges(), []);

  return (
    <HeaderContainer>
      <b>Staged changes</b>
      <Tooltip title="unstage all" mouseEnterDelay={1.5}>
        <ButtonIcon onClick={unstage}>
          <MinusOutlined />
        </ButtonIcon>
      </Tooltip>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Row)`
  justify-content: space-between;
  padding: 0 8px;
`;

const StatusFile: React.FC<{ statusFile: StatusFile }> = ({ statusFile }) => {
  const unstage = React.useCallback(() => unstageChanges(statusFile), [
    statusFile,
  ]);
  const diff = React.useCallback(() => getDiff(statusFile.path), [statusFile]);

  return (
    <ListItem onClick={diff}>
      <Row>
        <Row>
          <Tooltip title={toStatusFileAction(statusFile.stage)}>
            <StatusFileAction color={toColor(statusFile.stage)}>
              {statusFile.stage}
            </StatusFileAction>
          </Tooltip>
          <span>{statusFile.path}</span>
        </Row>
        <Row>
          <Tooltip title="unstage" mouseEnterDelay={1.5}>
            <ButtonIcon onClick={unstage}>
              <MinusOutlined />
            </ButtonIcon>
          </Tooltip>
        </Row>
      </Row>
    </ListItem>
  );
};
