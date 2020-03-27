import * as React from "react";
import { Column, Row } from "ui";
import { Form, Tag, Input } from "antd";
import { useStore } from "effector-react";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { Branch } from "lib/branch";

import * as model from "./model";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export const Settings: React.FC = () => {
  const settings = useStore(model.$settings);

  return (
    <Column>
      <b>Settings</b>
      <Row>
        <FormStyled size="small" {...layout}>
          <Form.Item label="Path">
            <div>{settings.cwd}</div>
          </Form.Item>
          <Form.Item label="Hot keys">
            <div>{settings.hotKeys.join(",")}</div>
          </Form.Item>
          <Form.Item label="Commit types">
            <CommitTypes />
          </Form.Item>
        </FormStyled>
      </Row>
    </Column>
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
    <Row bottom={true}>
      {list}
      <Branch if={visibleInput}>
        <CommitTypesImput onBlur={blur} />
        <TagDashed onClick={show}>
          <PlusOutlined />
          Add type
        </TagDashed>
      </Branch>
    </Row>
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
    />
  );
};

const FormStyled = styled(Form)`
  width: 100%;
`;

const TagDashed = styled(Tag)`
  border-style: dashed !important;
  background-color: #ffffff !important;
`;

const InputStyled = styled(Input)`
  max-width: 77px;
`;
