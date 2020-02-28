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
import { HotKey } from "features/hot-key";

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

  const fetchRef = React.useRef<HTMLSpanElement>(null);
  const pullRef = React.useRef<HTMLSpanElement>(null);
  const pushRef = React.useRef<HTMLSpanElement>(null);

  return (
    <Row>
      <HotKey
        command="command+shift+f"
        title="shift + f"
        bindRef={fetchRef}
        action="click"
      >
        <Tooltip title="Fetch">
          <span onClick={fetch} style={{ cursor: "pointer" }} ref={fetchRef}>
            <Icon type="sync" spin={pendingFetch} />
          </span>
        </Tooltip>
      </HotKey>

      <HotKey
        command="command+shift+l"
        title="shift + l"
        bindRef={pullRef}
        action="click"
        top="100%"
      >
        <Tooltip title="Pull rebase">
          <Spin size="small" spinning={pendingPull}>
            <span onClick={pull} style={{ cursor: "pointer" }} ref={pullRef}>
              <Icon type="arrow-down" />
              <span>{diffLog.pull.size}</span>
            </span>
          </Spin>
        </Tooltip>
      </HotKey>

      <HotKey
        command="command+shift+s"
        title="shift + s"
        bindRef={pushRef}
        action="click"
      >
        <Tooltip title="Push">
          <Spin size="small" spinning={pendingPush}>
            <span onClick={push} style={{ cursor: "pointer" }} ref={pushRef}>
              <Icon type="arrow-up" />
              <span>{diffLog.push.size}</span>
            </span>
          </Spin>
        </Tooltip>
      </HotKey>
    </Row>
  );
};
