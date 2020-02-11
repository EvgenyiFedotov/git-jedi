import * as React from "react";
import { Tag, message, Divider, Icon } from "antd";
import { blue, cyan } from "@ant-design/colors";
import styled from "styled-components";
import { Commit as CommitGit, CommitCalc, Ref } from "features/state-git-v2";
import { Branch } from "lib/branch";
// import { rebaseUp } from "features/state-git"; // TODO rebase

export const hashCopied = () => message.success("Commit hash copied", 1);

export const getColorStringCommit = (
  commitCalc: CommitCalc,
): string | undefined => {
  return commitCalc.isMerged ? "cyan" : "blue";
};

export const getColorCommit = (commitCalc: CommitCalc): string | undefined => {
  return commitCalc.isMerged ? cyan.primary : blue.primary;
};

export const Commit: React.FC<{
  commit: CommitGit;
  commitCalc: CommitCalc;
  refs: Ref[];
}> = ({ commit, commitCalc, refs }) => {
  const { hash } = commit;
  const { messageFormatted, isLast } = commitCalc;
  const { type, scope, note } = messageFormatted;

  const color = getColorCommit(commitCalc);

  const refList = refs.map((ref) => {
    const { type, shortName, name } = ref;
    const color = type === "tags" ? "purple" : getColorStringCommit(commitCalc);
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
    <CommitContainer>
      <CommitBlock>
        <a style={{ color, marginRight: "8px" }} onClick={clickHash}>
          {hash.substr(0, 8)}
        </a>

        <CommitTag color={color}>
          {type}
          <Branch if={!!scope}>
            <>
              <CommitDevider type="vertical" />
              <>{scope}</>
            </>
          </Branch>
        </CommitTag>

        <Branch if={!isLast}>
          <MyIcon
            type="branches"
            title="Rebase up"
            // onClick={() => rebaseUp(`${hash}~1`)}
          />
        </Branch>
      </CommitBlock>

      <CommitBlock>{refList}</CommitBlock>

      <CommitNote>{note}</CommitNote>
    </CommitContainer>
  );
};

const MyIcon = styled(Icon)`
  cursor: pointer;
`;

const CommitContainer = styled.div`
  border-radius: 3px;

  & ${MyIcon} {
    visibility: hidden;
  }

  &:hover ${MyIcon} {
    visibility: visible;
  }
`;

const CommitDevider = styled(Divider)``;

const CommitTag = styled(Tag)``;

const CommitBlock = styled.div`
  display: flex;
  flex: none;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;

  & > ${CommitDevider}, ${CommitTag}, a,
  ${MyIcon} {
    margin-bottom: 8px;
  }
`;

const CommitNote = styled.div`
  white-space: pre;
`;
