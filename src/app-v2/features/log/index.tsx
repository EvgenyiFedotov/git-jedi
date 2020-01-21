import * as React from "react";
import { Timeline, Tag, message, Divider, Icon, Tooltip, Input } from "antd";
import { useStore } from "effector-react";
import { blue } from "@ant-design/colors";
import styled from "styled-components";

import {
  $log,
  Commit,
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

const { TextArea } = Input;

export const Log: React.FC = () => {
  const log = useStore($log);
  const status = useStore($status);

  const changes = React.useMemo(() => {
    return status.length ? (
      <Timeline.Item dot={<Icon type="bars" />}>
        <Changes />
      </Timeline.Item>
    ) : (
      undefined
    );
  }, [status.length]);

  const listLog = Array.from(log.values()).map(commit => (
    <Commit key={commit.hash} commit={commit} />
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

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <b>
          Changes
          <Divider type="vertical" />
          <span style={{ color: blue.primary }}>{status.length}</span>
        </b>
      </div>

      <TextArea
        placeholder="Commit message"
        autoSize={{ maxRows: 4 }}
        style={{ marginBottom: "8px", maxWidth: `${16 * 24}px` }}
      />

      <UnstageChanges />
      <StageChanges />
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

const Commit: React.FC<{ commit: Commit }> = ({ commit }) => {
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
    <Timeline.Item>
      <div>
        <Hash onClick={clickHash}>{hash.substr(0, 6)}</Hash>
        <Branch if={!!refList.length}>
          <Divider type="vertical" />
        </Branch>
        {refList}
      </div>
      <div>{note}</div>
    </Timeline.Item>
  );
};

const Hash = styled.span`
  cursor: pointer;
  color: ${blue.primary};

  &:hover {
    text-decoration: underline;
  }
`;
