import * as React from "react";
import { useStore } from "effector-react";
import { Row, Column, StatusFileAction, ButtonIcon } from "ui";
import {
  RollbackOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Tooltip, List, Popconfirm } from "antd";
import { toStatusFileAction, toColor } from "lib/status-file-action";
import { ListItem } from "ui/antd";
import styled from "styled-components";
import { Branch } from "lib/branch";
import { DiffFile } from "ui/diff-file";

import {
  $unstagedStatus,
  StatusFile,
  discardChanges,
  stageChanges,
  $discardingChanges,
  discardAllChanges,
  stageAllChanges,
  getDiff,
  createPatchByChunk,
  createPatchByLine,
} from "./model";

export const UnstagedStatus: React.FC = () => {
  const { ref: unstagedStatus } = useStore($unstagedStatus);

  if (!unstagedStatus.size) {
    return null;
  }

  const list = Array.from(unstagedStatus.values()).map((statusFile) => (
    <React.Fragment key={statusFile.path}>
      <StatusFile statusFile={statusFile} />
      {statusFile.diff ? (
        <DiffFile
          diffFile={statusFile.diff}
          status="unstage"
          onClickChunk={createPatchByChunk}
          onClickLine={createPatchByLine}
        />
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
  const discard = React.useCallback(() => discardAllChanges(), []);
  const stage = React.useCallback(() => stageAllChanges(), []);

  return (
    <HeaderContainer>
      <b>Unstaged changes</b>
      <Row>
        <Popconfirm
          placement="topRight"
          title="Are you sure?"
          onConfirm={discard}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="discard all" mouseEnterDelay={1.5}>
            <ButtonIcon>
              <RollbackOutlined />
            </ButtonIcon>
          </Tooltip>
        </Popconfirm>
        <Tooltip title="stage all" mouseEnterDelay={1.5}>
          <ButtonIcon onClick={stage}>
            <PlusOutlined />
          </ButtonIcon>
        </Tooltip>
      </Row>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Row)`
  justify-content: space-between;
  padding: 0 8px;
`;

const StatusFile: React.FC<{ statusFile: StatusFile }> = ({ statusFile }) => {
  const discard = React.useCallback(
    (event) => {
      event.stopPropagation();
      discardChanges(statusFile);
    },
    [statusFile],
  );
  const stage = React.useCallback(
    (event) => {
      event.stopPropagation();
      stageChanges(statusFile);
    },
    [statusFile],
  );
  const diff = React.useCallback(() => getDiff(statusFile.path), [statusFile]);

  return (
    <ListItem onClick={diff}>
      <Row>
        <Row>
          <StatusFileState statusFile={statusFile} />
          <span>{statusFile.path}</span>
        </Row>
        <Row>
          <Popconfirm
            placement="topRight"
            title="Are you sure?"
            onConfirm={discard}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="discard" mouseEnterDelay={1.5}>
              <ButtonIcon>
                <RollbackOutlined />
              </ButtonIcon>
            </Tooltip>
          </Popconfirm>
          <Tooltip title="stage" mouseEnterDelay={1.5}>
            <ButtonIcon onClick={stage}>
              <PlusOutlined />
            </ButtonIcon>
          </Tooltip>
        </Row>
      </Row>
    </ListItem>
  );
};

const StatusFileState: React.FC<{ statusFile: StatusFile }> = ({
  statusFile,
}) => {
  const { unstage, path } = statusFile;
  const isDiscarding = useStore($discardingChanges).ref.has(path);

  return (
    <Branch if={isDiscarding}>
      <LoadingOutlined />
      <Tooltip title={toStatusFileAction(unstage)}>
        <StatusFileAction color={toColor(unstage)}>{unstage}</StatusFileAction>
      </Tooltip>
    </Branch>
  );
};
