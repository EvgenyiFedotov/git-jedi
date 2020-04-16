import * as React from "react";
import { Column, Row } from "ui";
import styled from "styled-components";
import { AutoComplete, Switch, Button, Input } from "antd";
import { useMousetrap } from "lib/use-mousetrap";
import { createVisible } from "lib/added-effector/visible";
import { useStore } from "effector-react";
import * as model from "model";

const {
  type,
  scope,
  breakingChangesFlag,
  title,
  $titleAddon,
  body,
  breakingChanges,
} = model.newCommit;

const visibleBody = createVisible();

export const NewCommit: React.FC = () => {
  return (
    <SCommitForm>
      <Header />
      <Title />
      <Body />
      <BreakingChanges />
    </SCommitForm>
  );
};

const Header: React.FC = () => {
  return (
    <SRow>
      <Type />
      <BreakingChangesFlag />
      <Scope />
    </SRow>
  );
};

const Type: React.FC = () => {
  const value = useStore(type.$value);
  const list = useStore(type.$list);

  return (
    <SType>
      <AutoComplete
        placeholder="type"
        autoFocus
        value={value}
        onChange={type.changeValue}
        options={list}
      />
    </SType>
  );
};

const BreakingChangesFlag: React.FC = () => {
  const value = useStore(breakingChangesFlag.$value);

  return (
    <Row>
      <div style={{ whiteSpace: "nowrap" }}>Breaking changes</div>
      <Switch checked={value} onChange={breakingChangesFlag.change} />
    </Row>
  );
};

const Scope: React.FC = () => {
  const value = useStore(scope.$value);
  const list = useStore(scope.$list);

  return (
    <SScope>
      <AutoComplete
        placeholder="scope"
        value={value}
        onChange={scope.changeValue}
        options={list}
      />
    </SScope>
  );
};

const Title: React.FC = () => {
  const { ref } = useMousetrap("enter", () => visibleBody.show(), "keyup");
  const isVisibleBody = useStore(visibleBody.$value);
  const bChFlag = useStore(breakingChangesFlag.$value);
  const value = useStore(title.$value);
  const titleAddon = useStore($titleAddon);

  const button = React.useMemo(
    () => (isVisibleBody || bChFlag ? null : <ButtonCommit />),
    [isVisibleBody, bChFlag],
  );

  return (
    <SRow>
      <Input
        ref={ref}
        placeholder="title"
        value={value}
        onChange={title.change}
        addonAfter={`${titleAddon.current} / ${titleAddon.total}`}
      />
      {button}
    </SRow>
  );
};

const Body: React.FC = () => {
  const visible = useStore(visibleBody.$value);
  const bChFlag = useStore(breakingChangesFlag.$value);
  const value = useStore(body.$value);

  const button = React.useMemo(() => (bChFlag ? null : <ButtonCommit />), [
    bChFlag,
  ]);

  if (visible) {
    return (
      <SRow>
        <Input.TextArea
          placeholder="body"
          autoSize={{ maxRows: 4 }}
          autoFocus
          value={value}
          onChange={body.change}
        />
        {button}
      </SRow>
    );
  }

  return null;
};

const BreakingChanges: React.FC = () => {
  const bChFlag = useStore(breakingChangesFlag.$value);
  const value = useStore(breakingChanges.$value);

  if (bChFlag) {
    return (
      <SRow>
        <Input.TextArea
          placeholder="breaking changes"
          autoSize={{ maxRows: 4 }}
          value={value}
          onChange={breakingChanges.change}
        />
        <ButtonCommit />
      </SRow>
    );
  }

  return null;
};

const ButtonCommit: React.FC = () => {
  return <Button type="primary">Commit</Button>;
};

const SCommitForm = styled(Column)`
  padding: 0 8px;
`;

const SRow = styled(Row)`
  flex-wrap: nowrap;
`;

const SType = styled.div`
  min-width: 100px;

  & > * {
    width: 100%;
  }
`;

const SScope = styled.div`
  width: 100%;

  & > * {
    width: 100%;
  }
`;

function onChangeText(cb: (value: string) => void) {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    cb(event.currentTarget.value);
  };
}
