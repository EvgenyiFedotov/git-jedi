import * as React from "react";
import { useStore } from "effector-react";
import { Button } from "antd";

import {
  $contentCommitMessageFormatted,
  abortRebase,
  writeContentCommitMessage,
  changeContentCommitMessageFormatted,
} from "features/state-git"; // TODO rebase
import { CommitForm } from "features/commit-form";
import { Column } from "ui";

export const EditCommitMessage: React.FC = () => {
  const contentCommitMessage = useStore($contentCommitMessageFormatted);

  return (
    <Column>
      <CommitForm
        value={contentCommitMessage}
        onChange={changeContentCommitMessageFormatted}
      />
      <Button onClick={() => abortRebase()}>Abort</Button>
      <Button type="primary" onClick={() => writeContentCommitMessage()}>
        Next
      </Button>
    </Column>
  );
};
