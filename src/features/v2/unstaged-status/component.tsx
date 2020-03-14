import * as React from "react";
import { useStore } from "effector-react";
import { Row, Column, StatusFileAction, ButtonIcon } from "ui";
import { RollbackOutlined, PlusOutlined } from "@ant-design/icons";
import { Tooltip, List } from "antd";
import { toStatusFileAction, toColor } from "lib/status-file-action";
import { ListItem } from "ui/antd";
import styled from "styled-components";

import { $unstagedStatus, StatusFile } from "./model";

export const UnstagedStatus: React.FC = () => {
  const unstagedStatus = useStore($unstagedStatus);

  const list = unstagedStatus.map((statusFile) => (
    <StatusFile key={statusFile.path} statusFile={statusFile} />
  ));

  return (
    <Column>
      <Header />
      <List size="small">{list}</List>
    </Column>
  );
};

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <b>Unstaged changes</b>
      <Row>
        <Tooltip title="discard all">
          <ButtonIcon>
            <RollbackOutlined />
          </ButtonIcon>
        </Tooltip>
        <Tooltip title="stage all">
          <ButtonIcon>
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
  return (
    <ListItem>
      <Row>
        <Row>
          <Tooltip title={toStatusFileAction(statusFile.unstage)}>
            <StatusFileAction color={toColor(statusFile.unstage)}>
              {statusFile.unstage}
            </StatusFileAction>
          </Tooltip>
          <span>{statusFile.path}</span>
        </Row>
        <Row>
          <Tooltip title="discard">
            <ButtonIcon>
              <RollbackOutlined />
            </ButtonIcon>
          </Tooltip>
          <Tooltip title="stage">
            <ButtonIcon>
              <PlusOutlined />
            </ButtonIcon>
          </Tooltip>
        </Row>
      </Row>
    </ListItem>
  );
};
