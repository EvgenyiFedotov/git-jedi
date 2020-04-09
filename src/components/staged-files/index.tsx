import * as React from "react";
import * as ui from "ui";
import * as uiAntd from "ui/antd";
import * as antd from "antd";
import * as antdIcons from "@ant-design/icons";
import styled from "styled-components";
import * as model from "model";
import { useStore } from "effector-react";
import { toStatusFileAction, toColor } from "lib/status-file-action";

const { $stagedFiles } = model.statusFiles;
const {
  unstageAll,
  unstageFile,
  unstageChunk,
  unstageLine,
} = model.unstageFiles;

export const StagedFiles: React.FC = () => {
  return (
    <ui.Column>
      <Header />
      <List />
    </ui.Column>
  );
};

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <b>Staged changes</b>
      <ButtonUnstageAll />
    </HeaderContainer>
  );
};

const ButtonUnstageAll: React.FC = () => {
  const click = React.useCallback(() => {
    unstageAll();
  }, []);

  return (
    <antd.Tooltip title="unstage all" mouseEnterDelay={1.5}>
      <ui.ButtonIcon onClick={click}>
        <antdIcons.MinusOutlined />
      </ui.ButtonIcon>
    </antd.Tooltip>
  );
};

const List: React.FC = () => {
  const stagedFiles = useStore($stagedFiles);

  if (stagedFiles.length === 0) {
    return <ui.RowPadding>List is empty</ui.RowPadding>;
  }

  const list = stagedFiles.map((statusFile) => (
    <Item statusFile={statusFile} key={statusFile.path} />
  ));

  return <antd.List size="small">{list}</antd.List>;
};

type ItemProps = {
  statusFile: model.statusFiles.StatusFile;
};

const Item: React.FC<ItemProps> = ({ statusFile }) => {
  return (
    <uiAntd.ListItem>
      <ui.Row>
        <ui.Row>
          <Status statusFile={statusFile} />
          <span>{statusFile.path}</span>
        </ui.Row>
        <ui.Row>
          <ButtonUnstage statusFile={statusFile} />
        </ui.Row>
      </ui.Row>
    </uiAntd.ListItem>
  );
};

const Status: React.FC<ItemProps> = ({ statusFile }) => {
  const { stage } = statusFile;

  const title = React.useMemo(() => toStatusFileAction(stage), [stage]);
  const color = React.useMemo(() => toColor(stage), [stage]);

  return (
    <antd.Tooltip mouseEnterDelay={1.5} title={title}>
      <ui.StatusFileAction color={color}>{stage}</ui.StatusFileAction>
    </antd.Tooltip>
  );
};

const ButtonUnstage: React.FC<ItemProps> = ({ statusFile }) => {
  const click = React.useCallback(() => {
    unstageFile(statusFile.path);
  }, [statusFile]);

  return (
    <antd.Tooltip title="unstage" mouseEnterDelay={1.5}>
      <ui.ButtonIcon onClick={click}>
        <antdIcons.MinusOutlined />
      </ui.ButtonIcon>
    </antd.Tooltip>
  );
};

const HeaderContainer = styled(ui.RowPadding)`
  justify-content: space-between;
`;
