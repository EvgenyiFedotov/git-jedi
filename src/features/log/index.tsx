import * as React from "react";
import { Timeline, Icon } from "antd";
import { useStore } from "effector-react";

import {
  $logOriginal,
  $logCalc,
  $status,
  $refsByCommitHash,
} from "features/state-git";
import { Branch } from "lib/branch";
import { Changes } from "features/changes";
import { toggleIsShowChanges } from "features/changes/model";
import { Commit, getColorCommit } from "features/commit";

export const Log: React.FC = () => {
  const logOriginal = useStore($logOriginal);
  const logCalc = useStore($logCalc);
  const refsByCommitHash = useStore($refsByCommitHash);
  const status = useStore($status);

  const listLog = Array.from(logOriginal.values()).map((commit, index) => {
    const commitCalc = logCalc.get(commit.hash);
    const refs = refsByCommitHash.get(commit.hash);

    if (!commitCalc) return null;

    const color = getColorCommit(commitCalc);

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
