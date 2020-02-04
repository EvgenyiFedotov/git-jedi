import * as React from "react";
import { useStore } from "effector-react";
import * as antd from "antd";
import styled from "styled-components";

import { useMousetrap } from "lib/use-mousetrap";
import { FormattedCommitMessage } from "features/state-git";

import {
  $types,
  $type,
  $note,
  changeType,
  changeNote,
  formatNote,
  mount,
} from "./model";

export interface CommitFormProps {
  value?: FormattedCommitMessage;
  onChange?: (value: FormattedCommitMessage) => void;
  onSave?: () => void;
}

export const CommitForm: React.FC<CommitFormProps> = (props) => {
  const { value, onChange = () => {}, onSave = () => {} } = props;

  const types = useStore($types);
  const type = useStore($type);
  const note = useStore($note);

  const { ref: messageRef } = useMousetrap("command+enter", onSave);

  React.useEffect(() => {
    if (value) {
      mount(value);
    }
  }, []);

  React.useEffect(() => {
    onChange({ type, note, scope: "" });
  }, [type, note]);

  return (
    <Container>
      <antd.Select className="select" value={type} onChange={changeType}>
        {types.map((typeValue) => (
          <antd.Select.Option key={typeValue} value={typeValue}>
            {typeValue}
          </antd.Select.Option>
        ))}
      </antd.Select>

      <TextArea
        placeholder="Message (⌘Enter to commit)"
        ref={messageRef}
        autoSize={{ maxRows: 4 }}
        value={note}
        onChange={changeNote}
        onBlur={formatNote}
      />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;

  & > .select {
    width: 90px;
    margin-right: 8px;
  }
`;

const TextArea = styled(antd.Input.TextArea)`
  max-width: calc(16 * 24px) !important;
`;
