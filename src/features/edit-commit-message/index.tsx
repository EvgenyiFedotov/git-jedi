import * as React from "react";
import { useStore } from "effector-react";
import { Button } from "antd";

import {
  $contentCommitMessageFormatted,
  abortRebase,
  saveContentCommitMessage,
  changeContentCommitMessageFormatted,
} from "features/state-git";
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
      <Button type="primary" onClick={() => saveContentCommitMessage()}>
        Next
      </Button>
    </Column>
  );
};
