import * as React from "react";
import { Column, Row } from "ui";
import { useStore } from "effector-react";
import { Autocomplete } from "molecules/autocomplete";
import { Input } from "antd";
import styled from "styled-components";
import { Switch, Button } from "antd";
import { useMousetrap } from "lib/use-mousetrap";

import * as model from "./model";

export const FormCreateCommit: React.FC = () => {
  return (
    <Column>
      <TypeScopeRow>
        <Type />
        <BreakingChangesFlag />
        <Scope />
      </TypeScopeRow>
      <TypeScopeRow style={{ alignItems: "flex-start" }}>
        <Title />
        <ButtonCommitTitle />
      </TypeScopeRow>
      <BodyRow />
      <BreakingChangesRow />
    </Column>
  );
};

const Type: React.FC = () => {
  const options = useStore(model.types.$options);
  const search = useStore(model.types.$search);

  return (
    <AutocompleteWrapper>
      <Autocomplete
        placeholder="type"
        options={options}
        value={search}
        onSearch={model.types.changeSearch}
        onSelect={model.types.selectValue}
        autoFocus
      />
    </AutocompleteWrapper>
  );
};

const BreakingChangesFlag: React.FC = () => {
  const value = useStore(model.$breakingChangesFlag);

  return (
    <Row>
      <div style={{ whiteSpace: "nowrap" }}>Breaking changes</div>
      <Switch checked={value} onChange={model.changeBreakingChangesFlag} />
    </Row>
  );
};

const Scope: React.FC = () => {
  const options = useStore(model.scopes.$options);
  const search = useStore(model.scopes.$search);

  return (
    <Autocomplete
      placeholder="scope"
      options={options}
      value={search}
      onSearch={model.scopes.changeSearch}
      onSelect={model.scopes.selectValue}
    />
  );
};

const Title: React.FC = () => {
  const { ref } = useMousetrap(
    "enter",
    () => {
      model.visibleBody.show();
    },
    "keyup",
  );
  const value = useStore(model.$title);
  const change = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      model.changeTitle(event.currentTarget.value);
    },
    [],
  );
  const countTitleLetters = useStore(model.$countTitleLetters);

  return (
    <Input
      ref={ref}
      placeholder="title"
      addonAfter={`${countTitleLetters.current}/${countTitleLetters.total}`}
      value={value}
      onChange={change}
    />
  );
};

const BodyRow: React.FC = () => {
  const visible = useStore(model.visibleBody.$value);

  if (visible === false) {
    return null;
  }

  return (
    <TypeScopeRow style={{ alignItems: "flex-start" }}>
      <Body />
      <ButtonCommitBody />
    </TypeScopeRow>
  );
};

const Body: React.FC = () => {
  const value = useStore(model.$body);
  const change = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      model.changeBody(event.currentTarget.value);
    },
    [],
  );

  return (
    <Input.TextArea
      placeholder="body"
      autoSize={{ maxRows: 4 }}
      value={value}
      onChange={change}
      autoFocus
    />
  );
};

const BreakingChangesRow: React.FC = () => {
  const flag = useStore(model.$breakingChangesFlag);

  if (!flag) {
    return null;
  }

  return (
    <TypeScopeRow style={{ alignItems: "flex-start" }}>
      <BreakingChanges />
      <ButtonCommit />
    </TypeScopeRow>
  );
};

const BreakingChanges: React.FC = () => {
  const value = useStore(model.$breakingChanges);
  const change = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      model.changeBreakingChanges(event.currentTarget.value);
    },
    [],
  );

  return (
    <Input.TextArea
      placeholder="breaking changes"
      autoSize={{ maxRows: 4 }}
      value={value}
      onChange={change}
    />
  );
};

const ButtonCommitTitle: React.FC = () => {
  const bcFlag = useStore(model.$breakingChangesFlag);
  const visibleBody = useStore(model.visibleBody.$value);

  if (bcFlag || visibleBody) {
    return null;
  }

  return <ButtonCommit />;
};

const ButtonCommitBody: React.FC = () => {
  const bcFlag = useStore(model.$breakingChangesFlag);

  if (bcFlag) {
    return null;
  }

  return <ButtonCommit />;
};

const ButtonCommit: React.FC = () => {
  return (
    <Button type="primary" onClick={() => model.createCommit()}>
      Commit
    </Button>
  );
};

const TypeScopeRow = styled(Row)`
  flex-wrap: nowrap;
`;

const AutocompleteWrapper = styled.div`
  min-width: 100px;
`;
