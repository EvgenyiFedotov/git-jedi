import * as React from "react";
import { useStore } from "effector-react";
import { blue, cyan, red, green } from "@ant-design/colors";
import styled from "styled-components";
import { Divider, Icon, Tooltip } from "antd";
import { Row } from "ui";

import {
  $status,
  $unstagedChanges,
  $discardPaths,
  $stagedChanges,
  addDiscardPath,
  discardAll,
  stage,
  stageAll,
  unstage,
  unstageAll,
  refreshStatus,
} from "features/state-git";
import { Branch } from "lib/branch";
import { ChangeLine } from "lib/api-git";
import { CommitForm } from "features/commit-form";
import { Column } from "ui";
import { Diff } from "features/diff";

import {
  $isShowChanges,
  $commitFormValue,
  changeCommitFormValue,
  createCommit,
  changeCommitFormValueByProp,
} from "./model";

export const Changes: React.FC = () => {
  const isShowChanges = useStore($isShowChanges);
  const unstagedChanges = useStore($unstagedChanges);
  const stagedChanges = useStore($stagedChanges);
  const status = useStore($status);

  return (
    <div>
      <Header />
      <Branch if={!!status.length && isShowChanges}>
        <Column>
          <CForm />
          <Branch if={!!stagedChanges.length}>
            <StageChanges />
          </Branch>
          <Branch if={!!unstagedChanges.length}>
            <UnstageChanges />
          </Branch>
        </Column>
      </Branch>
    </div>
  );
};

const CForm: React.FC = () => {
  const commitFormValue = useStore($commitFormValue);

  return (
    <CommitForm
      value={commitFormValue}
      onChange={changeCommitFormValue}
      onSave={() => createCommit()}
      onChangeByProp={changeCommitFormValueByProp}
    />
  );
};

const Header: React.FC = () => {
  const status = useStore($status);

  return (
    <div style={{ marginBottom: "8px" }}>
      <b style={{ marginRight: "8px" }}>Changes</b>
      <Icon
        type="reload"
        style={{ cursor: "pointer" }}
        onClick={() => refreshStatus()}
      />
      <Divider type="vertical" />
      <span style={{ color: blue.primary }}>{status.length}</span>
    </div>
  );
};

const UnstageChanges: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <i>
          Unstaged
          <Divider type="vertical" />
          <Icon
            type="rollback"
            title="Discard all changes"
            style={{ marginRight: "4px" }}
            onClick={() => discardAll()}
          />
          <Icon
            type="plus"
            onClick={() => stageAll()}
            title="Stage all changes"
          />
        </i>
      </div>
      <ListUnstageChanges />
    </div>
  );
};

const ListUnstageChanges: React.FC = (props) => {
  const unstageChanges = useStore($unstagedChanges);

  const list = unstageChanges.map((changeLine) => {
    return <UnstageChange key={changeLine.path} changeLine={changeLine} />;
  });

  return <div>{list}</div>;
};

const UnstageChange: React.FC<{ changeLine: ChangeLine }> = ({
  changeLine,
}) => {
  const { path, status } = changeLine;
  const discardPaths = useStore($discardPaths);
  const [isShowDiff, setIsShowDiff] = React.useState<boolean>(false);

  const click = React.useCallback(() => setIsShowDiff((prev) => !prev), [
    isShowDiff,
  ]);

  return (
    <Column>
      <Row style={{ justifyContent: "space-between" }}>
        <div>
          <Branch if={discardPaths.ref.has(path)}>
            <Icon type="loading" />
            <Status status={status} />
          </Branch>
          <Divider type="vertical" />
          <Icon
            type="rollback"
            title="Discard changes"
            style={{ marginRight: "4px" }}
            onClick={() => addDiscardPath(path)}
          />
          <Icon
            type="plus"
            title="Stage changes"
            onClick={() => stage([path])}
          />
          <Divider type="vertical" />
          {path}
        </div>
        <div>
          <Icon type="diff" style={{ cursor: "pointer" }} onClick={click} />
        </div>
      </Row>
      <Branch if={isShowDiff}>
        <Diff path={path} statusFile={status} />
      </Branch>
    </Column>
  );
};

const StageChanges: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <i>
          Staged
          <Divider type="vertical" />
          <Icon
            type="minus"
            title="Unstage all changes"
            onClick={() => unstageAll()}
          />
        </i>
      </div>

      <ListStageChanges />
    </div>
  );
};

const ListStageChanges: React.FC = () => {
  const stagedChanges = useStore($stagedChanges);

  const list = stagedChanges.map((changeLine) => {
    return <StageChange key={changeLine.path} changeLine={changeLine} />;
  });

  return <div>{list}</div>;
};

const StageChange: React.FC<{ changeLine: ChangeLine }> = ({ changeLine }) => {
  const { stagedStatus, path } = changeLine;
  const [isShowDiff, setIsShowDiff] = React.useState<boolean>(false);

  const click = React.useCallback(() => setIsShowDiff((prev) => !prev), [
    isShowDiff,
  ]);

  return (
    <Column>
      <Row style={{ justifyContent: "space-between" }}>
        <div>
          <Status status={stagedStatus} />
          <Divider type="vertical" />
          <Icon
            type="minus"
            title="Unstage changes"
            onClick={() => unstage(path)}
          />
          <Divider type="vertical" />
          {path}
        </div>
        <div>
          <Icon type="diff" style={{ cursor: "pointer" }} onClick={click} />
        </div>
      </Row>
      <Branch if={isShowDiff}>
        <Diff
          path={path}
          cached={true}
          reverse={true}
          statusFile={stagedStatus}
        />
      </Branch>
    </Column>
  );
};

const Status: React.FC<{
  status: ChangeLine["status"] | ChangeLine["stagedStatus"];
}> = ({ status }) => {
  return (
    <Tooltip title={status}>
      <StatusCotainer status={status}>
        {(status || "").substr(0, 1)}
      </StatusCotainer>
    </Tooltip>
  );
};

interface StatusCotainerProps {
  status: ChangeLine["status"] | ChangeLine["stagedStatus"];
}

const StatusCotainer = styled.span<StatusCotainerProps>`
  font-family: "Andale Mono", monospace;
  text-transform: uppercase;
  color: ${({ status }) => {
    switch (status) {
      case "added":
        return green.primary;
      case "deleted":
        return red.primary;
      case "untracked":
        return cyan.primary;
      default:
        return blue.primary;
    }
  }};
`;
