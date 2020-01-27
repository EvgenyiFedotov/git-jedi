import * as React from "react";
import {
  Timeline,
  Tag,
  message,
  Divider,
  Icon,
  Tooltip,
  Input,
  Select
} from "antd";
import { useStore } from "effector-react";
import { blue } from "@ant-design/colors";
import styled from "styled-components";

import {
  $log,
  Commit as GitCommit,
  $status,
  $stageChanges,
  $changes,
  $discarding,
  unstageChangesAll,
  stageChangesAll,
  stageChanges,
  unstageChanges,
  discardChanges
} from "../../../lib/effector-git";
import { Branch } from "../../managers/branch";
import { StatusPath } from "../../../lib/api-git";
import { useMousetrap } from "lib/use-mousetrap";

import {
  $message,
  changeCommiteMessage,
  formatMessage,
  createCommit,
  $types,
  $type,
  changeType
} from "./model";
import { $isShowChanges, toggleIsShowChanges } from "./state";

const { TextArea } = Input;
const { Option } = Select;

export const Log: React.FC = () => {
  const log = useStore($log);
  const status = useStore($status);

  const changes = React.useMemo(() => {
    return status.length ? (
      <Timeline.Item dot={<Icon type="bars" onClick={toggleIsShowChanges} />}>
        <Changes />
      </Timeline.Item>
    ) : (
      undefined
    );
  }, [status.length]);

  const listLog = Array.from(log.values()).map(commit => (
    <Timeline.Item key={commit.hash}>
      <Commit commit={commit} />
    </Timeline.Item>
  ));

  return (
    <Timeline>
      {changes}
      {listLog}
    </Timeline>
  );
};

const Changes: React.FC = () => {
  const status = useStore($status);
  const isShowChanges = useStore($isShowChanges);
  const message = useStore($message);
  const type = useStore($type);
  const types = useStore($types);

  const { ref: messageRef } = useMousetrap("command+enter", createCommit);

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <b>
          Changes
          <Divider type="vertical" />
          <span style={{ color: blue.primary }}>{status.length}</span>
        </b>
      </div>

      <Branch if={isShowChanges}>
        <>
          <div
            style={{
              marginBottom: "8px",
              display: "flex",
              alignItems: "flex-start"
            }}
          >
            <Select
              defaultValue={type}
              style={{ width: 90, marginRight: "8px" }}
              onChange={changeType}
            >
              {types.map(typeValue => (
                <Option key={typeValue} value={typeValue}>
                  {typeValue}
                </Option>
              ))}
            </Select>

            <TextArea
              placeholder="Message (⌘Enter to commit)"
              ref={messageRef}
              autoSize={{ maxRows: 4 }}
              style={{ maxWidth: `${16 * 24}px` }}
              value={message}
              onChange={changeCommiteMessage}
              onBlur={formatMessage}
            />
          </div>

          <UnstageChanges />
          <StageChanges />
        </>
      </Branch>
    </div>
  );
};

const UnstageChanges: React.FC = () => {
  const changes = useStore($changes);
  const discarding = useStore($discarding);

  const list = changes.map(status => {
    return (
      <div key={status.path}>
        <Branch if={discarding.has(status.path)}>
          <Icon type="loading" />
          <Status status={status.status} />
        </Branch>
        <Divider type="vertical" />
        <Icon
          type="rollback"
          title="Discard changes"
          style={{ marginRight: "4px" }}
          onClick={() => discardChanges(status.path)}
        />
        <Icon
          type="plus"
          title="Stage changes"
          onClick={() => stageChanges(status.path)}
        />
        <Divider type="vertical" />
        {status.path}
      </div>
    );
  });

  return (
    <Branch if={!!changes.length}>
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
              onClick={() => stageChangesAll()}
              title="Stage all changes"
            />
          </i>
        </div>

        <div>{list}</div>
      </div>
    </Branch>
  );
};

const StageChanges: React.FC = () => {
  const stageChanges = useStore($stageChanges);

  const list = stageChanges.map(status => {
    return (
      <div key={status.path}>
        <Status status={status.stagedStatus} />
        <Divider type="vertical" />
        <Icon
          type="minus"
          title="Unstage changes"
          onClick={() => unstageChanges(status.path)}
        />
        <Divider type="vertical" />
        {status.path}
      </div>
    );
  });

  return (
    <Branch if={!!stageChanges.length}>
      <div>
        <div style={{ marginBottom: "8px" }}>
          <i>
            Staged
            <Divider type="vertical" />
            <Icon
              type="minus"
              title="Unstage all changes"
              onClick={() => unstageChangesAll()}
            />
          </i>
        </div>

        <div>{list}</div>
      </div>
    </Branch>
  );
};

const Status: React.FC<{
  status: StatusPath["status"] | StatusPath["stagedStatus"];
}> = ({ status }) => {
  return (
    <Tooltip title={status}>
      <StatusCotainer>{(status || "").substr(0, 1)}</StatusCotainer>
    </Tooltip>
  );
};

const StatusCotainer = styled.span`
  font-family: "Andale Mono", monospace;
  text-transform: uppercase;
  color: ${blue.primary};
`;

const hashCopied = () => message.success("Commit hash copied", 1);

const Commit: React.FC<{ commit: GitCommit }> = ({ commit }) => {
  const { refs, hash, note } = commit;

  const refList = refs.map(ref => (
    <Tag color="blue" key={ref.name}>
      {ref.shortName}
    </Tag>
  ));

  const clickHash = React.useCallback(() => {
    window.navigator.clipboard.writeText(hash);
    hashCopied();
  }, [hash]);

  return (
    <div>
      <div>
        <a onClick={clickHash}>{hash.substr(0, 6)}</a>
        <Branch if={!!refList.length}>
          <Divider type="vertical" />
        </Branch>
        {refList}
      </div>
      <div>{note}</div>
    </div>
  );
};
