import * as React from "react";
import { Timeline, Icon } from "antd";
import { useStore } from "effector-react";

import { $logOriginal, $logCalc, $refsByCommitHash } from "features/state-git";
import { Changes } from "features/changes";
import { toggleIsShowChanges } from "features/changes/model";
import { Commit, getColorCommit } from "features/commit";
import { $diffLog } from "features/state-git";

export const Log: React.FC = () => {
  const logOriginal = useStore($logOriginal);
  const logCalc = useStore($logCalc);
  const refsByCommitHash = useStore($refsByCommitHash);
  const diffLog = useStore($diffLog);

  const listLog = Array.from(logOriginal.values()).map((commit, index) => {
    const commitCalc = logCalc.get(commit.hash);
    const refs = refsByCommitHash.get(commit.hash);

    if (!commitCalc) return null;

    const isPush = diffLog.push.has(commit.hash);
    const color = getColorCommit(commitCalc, { isPush });

    return (
      <Timeline.Item key={commit.hash} color={color}>
        <Commit commit={commit} commitCalc={commitCalc} refs={refs || []} />
      </Timeline.Item>
    );
  });

  return (
    <Timeline>
      <Timeline.Item dot={<Icon type="bars" onClick={toggleIsShowChanges} />}>
        <Changes />
      </Timeline.Item>
      {listLog}
    </Timeline>
  );
};
