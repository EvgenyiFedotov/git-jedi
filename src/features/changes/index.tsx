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

import {
  $isShowChanges,
  $commitFormValue,
  changeCommitFormValue,
  createCommit,
} from "./model";

export const Changes: React.FC = () => {
  const isShowChanges = useStore($isShowChanges);
  const unstagedChanges = useStore($unstagedChanges);
  const stagedChanges = useStore($stagedChanges);
  const commitFormValue = useStore($commitFormValue);
  const status = useStore($status);

  return (
    <div>
      <Header />
      <Branch if={!!status.length && isShowChanges}>
        <Column>
          <CommitForm
            value={commitFormValue}
            onChange={changeCommitFormValue}
            onSave={() => createCommit()}
          />
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
  const discardPaths = useStore($discardPaths);

  const list = unstageChanges.map((status) => {
    return (
      <div key={status.path}>
        <Branch if={discardPaths.ref.has(status.path)}>
          <Icon type="loading" />
          <Status status={status.status} />
        </Branch>
        <Divider type="vertical" />
        <Icon
          type="rollback"
          title="Discard changes"
          style={{ marginRight: "4px" }}
          onClick={() => addDiscardPath(status.path)}
        />
        <Icon
          type="plus"
          title="Stage changes"
          onClick={() => stage([status.path])}
        />
        <Divider type="vertical" />
        {status.path}
      </div>
    );
  });

  return <div>{list}</div>;
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

  const list = stagedChanges.map((status) => {
    return (
      <div key={status.path}>
        <Status status={status.stagedStatus} />
        <Divider type="vertical" />
        <Icon
          type="minus"
          title="Unstage changes"
          onClick={() => unstage(status.path)}
        />
        <Divider type="vertical" />
        {status.path}
      </div>
    );
  });

  return <div>{list}</div>;
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
