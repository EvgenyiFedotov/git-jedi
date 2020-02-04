import * as React from "react";
import { useStore } from "effector-react";
import { Button } from "antd";

import {
  $contentCommitMessage,
  abortRebase,
  writeContentCommitMessage,
  changeContentCommitMessage,
} from "features/state-git";
import { CommitForm } from "features/commit-form";
import { Column } from "ui";

export const EditCommitMessage: React.FC = () => {
  const contentCommitMessage = useStore($contentCommitMessage);

  return (
    <Column>
      <CommitForm
        value={contentCommitMessage}
        onChange={changeContentCommitMessage}
      />
      <Button onClick={() => abortRebase()}>Abort</Button>
      <Button type="primary" onClick={() => writeContentCommitMessage()}>
        Next
      </Button>
    </Column>
  );
};
