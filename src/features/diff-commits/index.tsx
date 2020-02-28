import * as React from "react";
import { Row } from "ui";
import { Icon, Tooltip, Spin } from "antd";
import {
  $diffLog,
  fetch as fetchGit,
  pull as pullGit,
  push as pushGit,
  $currentBranch,
  $pendingPull,
  $pendingPush,
  $pendingFetch,
} from "features/state-git";
import { useStore } from "effector-react";

import { createCommand, addCommand } from "features/commands";

const commandFetch = createCommand("fetch", () => fetchGit());

export const DiffCommits: React.FC = () => {
  const diffLog = useStore($diffLog);
  const pendingFetch = useStore($pendingFetch);
  const currentBranch = useStore($currentBranch);
  const pendingPull = useStore($pendingPull);
  const pendingPush = useStore($pendingPush);

  const fetch = React.useCallback(() => fetchGit(), []);
  const pull = React.useCallback(() => pullGit({ rebase: true }), []);
  const push = React.useCallback(
    () =>
      pushGit({
        setUpstream: true,
        repositoryRefSpec: ["origin", currentBranch || ""],
      }),
    [currentBranch],
  );

  React.useEffect(() => {
    addCommand(commandFetch);
  }, []);

  return (
    <Row>
      <Tooltip title="Fetch">
        <Icon
          type="sync"
          style={{ cursor: "pointer" }}
          onClick={fetch}
          spin={pendingFetch}
        />
      </Tooltip>
      <Tooltip title="Pull rebase">
        <Spin size="small" spinning={pendingPull}>
          <span onClick={pull} style={{ cursor: "pointer" }}>
            <Icon type="arrow-down" />
            <span>{diffLog.pull.size}</span>
          </span>
        </Spin>
      </Tooltip>
      <Tooltip title="Push">
        <Spin size="small" spinning={pendingPush}>
          <span onClick={push} style={{ cursor: "pointer" }}>
            <Icon type="arrow-up" />
            <span>{diffLog.push.size}</span>
          </span>
        </Spin>
      </Tooltip>
    </Row>
  );
};
