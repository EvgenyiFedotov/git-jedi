import * as React from "react";
import * as ui from "ui";
import * as uiAntd from "ui/antd";
import * as antd from "antd";
import * as antdIcons from "@ant-design/icons";
import styled from "styled-components";
import * as model from "model";
import { useStore } from "effector-react";
import { toStatusFileAction, toColor } from "lib/status-file-action";
import { DiffFile } from "ui/diff-file";

const { $stagedFiles } = model.statusFiles;
const { unstageAll, unstageFile } = model.unstageFiles;
const { loadStageDiff, $stagedDiffs } = model.stagedDiffFiles;

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
  const stagedFiles = useStore($stagedFiles);

  const click = React.useCallback(() => {
    unstageAll();
  }, []);

  if (stagedFiles.length === 0) {
    return null;
  }

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
  statusFile: model.types.StatusFile;
};

const Item: React.FC<ItemProps> = ({ statusFile }) => {
  const [showDiff, setShowDiff] = React.useState<boolean>(false);

  const click = React.useCallback(() => {
    if (showDiff) {
      setShowDiff(false);
    } else {
      loadStageDiff(statusFile.path);
      setShowDiff(true);
    }
  }, [showDiff, statusFile]);

  const diff = React.useMemo(() => {
    return showDiff ? <Diff statusFile={statusFile} /> : null;
  }, [showDiff, statusFile]);

  return (
    <>
      <uiAntd.ListItem onClick={click}>
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
      {diff}
    </>
  );
};

const Diff: React.FC<ItemProps> = ({ statusFile }) => {
  const diffFile = useStore($stagedDiffs).ref.get(statusFile.path);

  if (diffFile) {
    return <DiffFile diffFile={diffFile} status="stage" />;
  }

  return null;
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
  const click = React.useCallback(
    (event) => {
      event.stopPropagation();
      unstageFile(statusFile.path);
    },
    [statusFile],
  );

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
