import * as React from "react";
import * as antd from "antd";
import { ListItem } from "ui/antd";
import * as ui from "ui";
import styled from "styled-components";
import * as model from "model";
import { useStore } from "effector-react";
import { toStatusFileAction, toColor } from "lib/status-file-action";
import * as antdIcons from "@ant-design/icons";
import { DiffFile } from "ui/diff-file";

const { $statusFiles, $unstagedFiles } = model.statusFiles;
const { $discardingFiles, dicardFile, discardAll } = model.discardingFiles;
const { stageFile, stageAll } = model.stageFiles;
const { loadUnstagedDiff, $unstagedDiffs } = model.unstagedDiffFiles;

export const UnstagedFiles: React.FC = () => {
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
      <b>Unstaged changes</b>
      <HeaderButtons />
    </HeaderContainer>
  );
};

const HeaderButtons: React.FC = () => {
  const unstageFiles = useStore($unstagedFiles);

  if (unstageFiles.length === 0) {
    return null;
  }

  return (
    <ui.Row>
      <CheckAllDiscard />
      <ButtinStageAll />
    </ui.Row>
  );
};

const CheckAllDiscard: React.FC = () => {
  const statusFiles = useStore($statusFiles);
  const discardingFiles = useStore($discardingFiles).ref;

  if (discardingFiles.size > 0 && statusFiles.length === discardingFiles.size) {
    return <antdIcons.LoadingOutlined />;
  }

  return <ButtonDirscardAll />;
};

const ButtonDirscardAll: React.FC = () => {
  const discard = React.useCallback(() => discardAll(), []);

  return (
    <antd.Popconfirm
      placement="topRight"
      title="Are you sure?"
      okText="Yes"
      cancelText="No"
      onConfirm={discard}
    >
      <antd.Tooltip title="discard all" mouseEnterDelay={1.5}>
        <ui.ButtonIcon>
          <antdIcons.RollbackOutlined />
        </ui.ButtonIcon>
      </antd.Tooltip>
    </antd.Popconfirm>
  );
};

const ButtinStageAll: React.FC = () => {
  const click = React.useCallback(() => {
    stageAll();
  }, []);

  return (
    <antd.Tooltip title="stage all" mouseEnterDelay={1.5}>
      <ui.ButtonIcon onClick={click}>
        <antdIcons.PlusOutlined />
      </ui.ButtonIcon>
    </antd.Tooltip>
  );
};

const List: React.FC = () => {
  const unstageFiles = useStore($unstagedFiles);

  if (unstageFiles.length === 0) {
    return <ui.RowPadding>List is empty</ui.RowPadding>;
  }

  const list = unstageFiles.map((statusFile) => (
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
      loadUnstagedDiff(statusFile);
      setShowDiff(true);
    }
  }, [showDiff, statusFile]);

  const diff = React.useMemo(() => {
    return showDiff ? <Diff statusFile={statusFile} /> : null;
  }, [showDiff, statusFile]);

  return (
    <>
      <ListItem onClick={click}>
        <ui.Row>
          <ui.Row>
            <Status statusFile={statusFile} />
            <span>{statusFile.path}</span>
          </ui.Row>
          <ui.Row>
            <CheckDiscardingFile statusFile={statusFile} />
            <ButtonStageFile statusFile={statusFile} />
          </ui.Row>
        </ui.Row>
      </ListItem>
      {diff}
    </>
  );
};

const Diff: React.FC<ItemProps> = ({ statusFile }) => {
  const diffFile = useStore($unstagedDiffs).ref.get(statusFile.path);

  if (diffFile) {
    return <DiffFile diffFile={diffFile} status="unstage" />;
  }

  return null;
};

const Status: React.FC<ItemProps> = ({ statusFile }) => {
  const { unstage } = statusFile;

  const title = React.useMemo(() => toStatusFileAction(unstage), [unstage]);
  const color = React.useMemo(() => toColor(unstage), [unstage]);

  return (
    <antd.Tooltip mouseEnterDelay={1.5} title={title}>
      <ui.StatusFileAction color={color}>{unstage}</ui.StatusFileAction>
    </antd.Tooltip>
  );
};

const CheckDiscardingFile: React.FC<ItemProps> = ({ statusFile, children }) => {
  if (useStore($discardingFiles).ref.has(statusFile.path)) {
    return <antdIcons.LoadingOutlined />;
  }

  return <ButtonDiscardFile statusFile={statusFile} />;
};

const ButtonDiscardFile: React.FC<ItemProps> = ({ statusFile }) => {
  const click = React.useCallback(
    (event) => {
      event.stopPropagation();
      dicardFile(statusFile.path);
    },
    [statusFile],
  );

  return (
    <antd.Popconfirm
      placement="topRight"
      title="Are you sure?"
      okText="Yes"
      cancelText="No"
      onConfirm={click}
    >
      <antd.Tooltip title="discard" mouseEnterDelay={1.5}>
        <ui.ButtonIcon>
          <antdIcons.RollbackOutlined />
        </ui.ButtonIcon>
      </antd.Tooltip>
    </antd.Popconfirm>
  );
};

const ButtonStageFile: React.FC<ItemProps> = ({ statusFile }) => {
  const click = React.useCallback(
    (event) => {
      event.stopPropagation();
      stageFile(statusFile.path);
    },
    [statusFile],
  );

  return (
    <antd.Tooltip title="stage" mouseEnterDelay={1.5}>
      <ui.ButtonIcon onClick={click}>
        <antdIcons.PlusOutlined />
      </ui.ButtonIcon>
    </antd.Tooltip>
  );
};

const HeaderContainer = styled(ui.RowPadding)`
  justify-content: space-between;
`;
