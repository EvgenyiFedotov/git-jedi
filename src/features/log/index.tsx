import * as React from "react";
import { Timeline, Tag, message, Divider, Icon } from "antd";
import { useStore } from "effector-react";
import { blue, cyan } from "@ant-design/colors";
import styled from "styled-components";

import { $formatterdLog, FormattedCommit, $status } from "features/state-git";
import { Branch } from "lib/branch";
import { Changes } from "features/changes";

import { toggleIsShowChanges } from "./model";

const getColorStringCommit = (commit: FormattedCommit): string | undefined => {
  return commit.isMerged ? "cyan" : "blue";
};

const getColorCommit = (commit: FormattedCommit): string | undefined => {
  return commit.isMerged ? cyan.primary : blue.primary;
};

export const Log: React.FC = () => {
  const formatterdLog = useStore($formatterdLog);
  const status = useStore($status);

  const listLog = Array.from(formatterdLog.values()).map((commit) => {
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

const hashCopied = () => message.success("Commit hash copied", 1);

const Commit: React.FC<{ commit: FormattedCommit }> = ({ commit }) => {
  const { refs, hash, note, type, scope } = commit;
  const color = getColorCommit(commit);

  const refList = refs.map((ref) => {
    const { type, shortName, name } = ref;
    const color = type === "tags" ? "purple" : getColorStringCommit(commit);
    const text = type === "tags" ? shortName.replace("^{}", "") : shortName;

    return (
      <CommitTag color={color} key={name}>
        {text}
      </CommitTag>
    );
  });

  const clickHash = React.useCallback(() => {
    window.navigator.clipboard.writeText(hash);
    hashCopied();
  }, [hash]);

  return (
    <div>
      <CommitBlock>
        <a style={{ color }} onClick={clickHash}>
          {hash.substr(0, 8)}
        </a>
        <Branch if={!!type}>
          <>
            <CommitDevider type="vertical" />
            <CommitTag color={color}>
              {type}
              <Branch if={!!scope}>
                <>
                  <CommitDevider type="vertical" />
                  <>{scope}</>
                </>
              </Branch>
            </CommitTag>
          </>
        </Branch>
      </CommitBlock>
      <CommitBlock>{refList}</CommitBlock>
      <CommitNote>{note}</CommitNote>
    </div>
  );
};

const CommitDevider = styled(Divider)``;

const CommitTag = styled(Tag)``;

const CommitBlock = styled.div`
  display: flex;
  flex: none;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;

  & > ${CommitDevider}, ${CommitTag}, a {
    margin-bottom: 8px;
  }
`;

const CommitNote = styled.div`
  white-space: pre;
`;
