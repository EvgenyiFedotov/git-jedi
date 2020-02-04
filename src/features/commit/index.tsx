import * as React from "react";
import { Tag, message, Divider, Icon } from "antd";
import { blue, cyan } from "@ant-design/colors";
import styled from "styled-components";
// import { useStore } from "effector-react";

import { FormattedCommit } from "features/state-git";
import { Branch } from "lib/branch";
// import { CommitForm } from "features/commit-form";
import { rebaseUp } from "features/state-git";

// import {
//   editCommit,
//   $editCommitHash,
//   $commitFormValue,
//   changeCommitFormValue,
// } from "./modal";

export const hashCopied = () => message.success("Commit hash copied", 1);

export const getColorStringCommit = (
  commit: FormattedCommit,
): string | undefined => {
  return commit.isMerged ? "cyan" : "blue";
};

export const getColorCommit = (commit: FormattedCommit): string | undefined => {
  return commit.isMerged ? cyan.primary : blue.primary;
};

export const Commit: React.FC<{
  commit: FormattedCommit;
  isFirst: boolean;
}> = ({ commit, isFirst }) => {
  const { refs, hash, note, type, scope } = commit;

  const color = getColorCommit(commit);
  // const editCommitHash = useStore($editCommitHash);
  // const commitFormValue = useStore($commitFormValue);

  // const isEdit = editCommitHash === hash;

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

  // const edit = React.useCallback(() => {
  //   editCommit(hash);
  // }, [hash]);

  return (
    <CommitContainer>
      <CommitBlock>
        <a style={{ color, marginRight: "8px" }} onClick={clickHash}>
          {hash.substr(0, 8)}
        </a>

        {/* <Branch if={!!type && !isEdit}> */}
        <CommitTag color={color}>
          {type}
          <Branch if={!!scope}>
            <>
              <CommitDevider type="vertical" />
              <>{scope}</>
            </>
          </Branch>
        </CommitTag>
        {/* </Branch> */}

        <Branch if={!isFirst}>
          <MyIcon
            type="branches"
            title="Rebase up"
            onClick={() => rebaseUp(hash)}
          />
        </Branch>

        {/* <Branch if={!isEdit}>
          <IconIdit type="edit" onClick={edit} />
        </Branch> */}
      </CommitBlock>

      <CommitBlock>{refList}</CommitBlock>

      {/* <Branch if={!isEdit}> */}
      <CommitNote>{note}</CommitNote>
      {/* </Branch> */}

      {/* <Branch if={isEdit}>
        <CommitForm value={commitFormValue} onChange={changeCommitFormValue} />
      </Branch> */}
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
