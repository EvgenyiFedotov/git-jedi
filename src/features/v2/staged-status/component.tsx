import * as React from "react";
import { useStore } from "effector-react";
import { Row, Column, StatusFileAction, ButtonIcon } from "ui";
import { Tooltip } from "antd";
import { toStatusFileAction, toColor } from "lib/status-file-action";
import { MinusOutlined } from "@ant-design/icons";
import { ListItem } from "ui/antd";
import { List } from "antd";
import styled from "styled-components";

import { $stagedStatus, StatusFile } from "./model";

export const StagedStatus: React.FC = () => {
  const stagedStatus = useStore($stagedStatus);

  const list = stagedStatus.map((statusFile) => (
    <StatusFile key={statusFile.path} statusFile={statusFile} />
  ));

  return (
    <Column>
      <Header />
      <List>{list}</List>
    </Column>
  );
};

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <b>Staged changes</b>
      <Tooltip title="unstage all">
        <ButtonIcon>
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
  return (
    <ListItem>
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
          <Tooltip title="unstage">
            <ButtonIcon>
              <MinusOutlined />
            </ButtonIcon>
          </Tooltip>
        </Row>
      </Row>
    </ListItem>
  );
};
