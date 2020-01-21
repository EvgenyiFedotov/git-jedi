import * as React from "react";
import { Timeline, Tag, message, Divider, Icon } from "antd";
import { useStore } from "effector-react";
import { blue } from "@ant-design/colors";
import styled from "styled-components";

import {
  $log,
  Commit,
  $status,
  $stageChanges,
  $changes
} from "../../../lib/effector-git";
import { Branch } from "../../managers/branch";

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
      <div>
        <b>
          Changes
          <Divider type="vertical" />
          <span style={{ color: blue.primary }}>{status.length}</span>
        </b>
      </div>

      <UnstageChanges />
      <StageChanges />
    </div>
  );
};

const UnstageChanges: React.FC = () => {
  const changes = useStore($changes);

  const list = changes.map(status => {
    return (
      <div key={status.path}>
        <span
          style={{
            fontFamily: "monospace",
            textTransform: "uppercase",
            color: blue.primary
          }}
        >
          {(status.status || "").substr(0, 1)}
        </span>
        <Divider type="vertical" />
        {status.path}
      </div>
    );
  });

  return (
    <Branch if={!!changes.length}>
      <div>
        <i>
          Unstaged
          <Divider type="vertical" />
          <a>Stage all</a>
        </i>

        <div>{list}</div>
      </div>
    </Branch>
  );
};

const StageChanges: React.FC = () => {
  const stageChanges = useStore($stageChanges);

  return (
    <Branch if={!!stageChanges.length}>
      <div>
        <i>
          Staged
          <Divider type="vertical" />
          <a>Unstage all</a>
        </i>
      </div>
    </Branch>
  );
};

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
