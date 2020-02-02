import * as React from "react";
import { Timeline, Icon } from "antd";
import { useStore } from "effector-react";

import { $formattedLog, $status } from "features/state-git";
import { Branch } from "lib/branch";
import { Changes } from "features/changes";
import { toggleIsShowChanges } from "features/changes/model";
import { Commit, getColorCommit } from "features/commit";

export const Log: React.FC = () => {
  const formattedLog = useStore($formattedLog);
  const status = useStore($status);

  const listLog = Array.from(formattedLog.values()).map((commit) => {
    const color = getColorCommit(commit);

    return (
      <Timeline.Item key={commit.hash} color={color}>
        <Commit commit={commit} />
      </Timeline.Item>
    );
  });

  return (
    <Timeline>
      <Branch if={!!status.length}>
        <Timeline.Item dot={<Icon type="bars" onClick={toggleIsShowChanges} />}>
          <Changes />
        </Timeline.Item>
      </Branch>
      {listLog}
    </Timeline>
  );
};
