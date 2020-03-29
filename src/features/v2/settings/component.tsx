import * as React from "react";
import { Column, Row } from "ui";
import { Tag, Input, Divider } from "antd";
import { useStore } from "effector-react";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { Branch } from "lib/branch";

import * as model from "./model";

export const Settings: React.FC = () => {
  const settings = useStore(model.$settings);

  return (
    <Column style={{ width: "100%" }}>
      <Divider>Main</Divider>
      <Item label="Path">
        <div>{settings.cwd}</div>
      </Item>
      <Item label="Hot keys">
        <div>{settings.hotKeys.join(",")}</div>
      </Item>

      <Divider>Commit</Divider>
      <Item label="Types">
        <CommitTypes />
      </Item>

      <Item label="Scope root">
        <ScopeRoot />
      </Item>

      <Item label="Scope length">
        <ScopeLength />
      </Item>
    </Column>
  );
};

const Item: React.FC<{ label: React.ReactNode }> = ({ label, children }) => {
  return (
    <ItemContainer>
      <ItemLabel>{label}:</ItemLabel>
      <ItemChildren>{children}</ItemChildren>
    </ItemContainer>
  );
};

const CommitTypes: React.FC = () => {
  const [visibleInput, setVisibleInput] = React.useState<boolean>(false);

  const show = React.useCallback(() => {
    setVisibleInput(true);
  }, []);

  const blur = React.useCallback(() => {
    setVisibleInput(false);
  }, []);

  const commitTypes = useStore(model.$commitTypes);

  const list = commitTypes.map((item) => (
    <Tag key={item} closable onClose={() => model.removeCommitType(item)}>
      {item}
    </Tag>
  ));

  return (
    <CommitTypesContainer bottom={true}>
      {list}
      <Branch if={visibleInput}>
        <CommitTypesImput onBlur={blur} />
        <TagDashed onClick={show}>
          <PlusOutlined />
          Add type
        </TagDashed>
      </Branch>
    </CommitTypesContainer>
  );
};

const CommitTypesImput: React.FC<{ onBlur: () => void }> = ({ onBlur }) => {
  const newCommitType = useStore(model.$newCommitType);

  const blur = React.useCallback(() => {
    onBlur();
    model.addNewCommitType();
  }, [onBlur]);

  return (
    <InputStyled
      onBlur={blur}
      autoFocus={true}
      value={newCommitType}
      onChange={(event) => model.changeNewCommitType(event.currentTarget.value)}
      size="small"
    />
  );
};

const ScopeRoot: React.FC = () => {
  const value = useStore(model.$commitScopeRoot);

  const change = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      model.changeCommitScopeRoot(event.currentTarget.value);
    },
    [],
  );

  return <Input value={value} onChange={change} />;
};

const ScopeLength: React.FC = () => {
  const value = useStore(model.$commitScopeLength);

  const change = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      model.changeCommitScopeLength(parseInt(event.currentTarget.value, 10));
    },
    [],
  );

  return <Input type="number" value={value} onChange={change} />;
};

const TagDashed = styled(Tag)`
  border-style: dashed !important;
  background-color: #ffffff !important;
`;

const InputStyled = styled(Input)`
  max-width: 77px;
`;

const ItemContainer = styled(Row)`
  flex-wrap: nowrap;
  align-items: flex-start;
`;

const ItemLabel = styled(Column)`
  width: 25%;
  padding: 5px 2px;
  align-items: flex-end;
  justify-content: center;
`;

const ItemChildren = styled.div`
  width: 75%;
`;

const CommitTypesContainer = styled(Row)`
  padding-top: 5px;
`;
