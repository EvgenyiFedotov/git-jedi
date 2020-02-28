import * as React from "react";
import { Row } from "ui";
import { Icon, Tooltip } from "antd";
import {
  $diffLog,
  updateDiffLog,
  $pendingDiffLog,
  pull as pullGit,
  push as pushGit,
  $currentBranch,
} from "features/state-git";
import { useStore } from "effector-react";

export const DiffCommits: React.FC = () => {
  const diffLog = useStore($diffLog);
  const pendingDiffLog = useStore($pendingDiffLog);
  const currentBranch = useStore($currentBranch);

  const fetch = React.useCallback(() => updateDiffLog(), []);
  const pull = React.useCallback(() => pullGit({ rebase: true }), []);
  const push = React.useCallback(
    () =>
      pushGit({
        setUpstream: true,
        repositoryRefSpec: ["origin", currentBranch || ""],
      }),
    [currentBranch],
  );

  return (
    <Row>
      <Tooltip title="Fetch">
        <Icon
          type="sync"
          style={{ cursor: "pointer" }}
          onClick={fetch}
          spin={pendingDiffLog}
        />
      </Tooltip>
      <Tooltip title="Pull rebase">
        <span onClick={pull} style={{ cursor: "pointer" }}>
          <Icon type="arrow-down" />
          <span>{diffLog.pull.size}</span>
        </span>
      </Tooltip>
      <Tooltip title="Push">
        <span onClick={push} style={{ cursor: "pointer" }}>
          <Icon type="arrow-up" />
          <span>{diffLog.push.size}</span>
        </span>
      </Tooltip>
    </Row>
  );
};
