import * as React from "react";
import { useStore } from "effector-react";
import { blue, cyan, red, green } from "@ant-design/colors";
import styled from "styled-components";
import { Divider, Select, Input, Icon, Tooltip } from "antd";

import {
  $status,
  $unstagedChanges,
  $discardPaths,
  $stagedChanges,
  discard,
  stage,
  stageAll,
  unstage,
  unstageAll,
} from "features/state-git";
import { useMousetrap } from "lib/use-mousetrap";
import { Branch } from "lib/branch";
import { StatusPath } from "lib/api-git";

import {
  createCommit,
  $type,
  $types,
  $message,
  $isShowChanges,
  changeMessage,
  changeType,
  formatMessage,
} from "./model";

export const Changes: React.FC = () => {
  const isShowChanges = useStore($isShowChanges);
  const unstagedChanges = useStore($unstagedChanges);
  const stagedChanges = useStore($stagedChanges);

  return (
    <div>
      <Header />
      <Branch if={isShowChanges}>
        <>
          <CommitForm />
          <Branch if={!!unstagedChanges.length}>
            <UnstageChanges />
          </Branch>

          <Branch if={!!stagedChanges.length}>
            <StageChanges />
          </Branch>
        </>
      </Branch>
    </div>
  );
};

const Header: React.FC = () => {
  const status = useStore($status);

  return (
    <div style={{ marginBottom: "8px" }}>
      <b>
        Changes
        <Divider type="vertical" />
        <span style={{ color: blue.primary }}>{status.length}</span>
      </b>
    </div>
  );
};

const CommitForm: React.FC = () => {
  const type = useStore($type);
  const types = useStore($types);
  const message = useStore($message);

  const { ref: messageRef } = useMousetrap("command+enter", createCommit);

  return (
    <div
      style={{
        marginBottom: "8px",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <Select
        defaultValue={type}
        style={{ width: 90, marginRight: "8px" }}
        onChange={changeType}
      >
        {types.map((typeValue) => (
          <Select.Option key={typeValue} value={typeValue}>
            {typeValue}
          </Select.Option>
        ))}
      </Select>

      <Input.TextArea
        placeholder="Message (⌘Enter to commit)"
        ref={messageRef}
        autoSize={{ maxRows: 4 }}
        style={{ maxWidth: `${16 * 24}px` }}
        value={message}
        onChange={changeMessage}
        onBlur={formatMessage}
      />
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
        <Branch if={discardPaths.has(status.path)}>
          <Icon type="loading" />
          <Status status={status.status} />
        </Branch>
        <Divider type="vertical" />
        <Icon
          type="rollback"
          title="Discard changes"
          style={{ marginRight: "4px" }}
          onClick={() => discard(status.path)}
        />
        <Icon
          type="plus"
          title="Stage changes"
          onClick={() => stage(status.path)}
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
  status: StatusPath["status"] | StatusPath["stagedStatus"];
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
  status: StatusPath["status"] | StatusPath["stagedStatus"];
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
