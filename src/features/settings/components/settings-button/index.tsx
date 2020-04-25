import * as React from "react";
import { useStore } from "effector-react";
import { Pointer, Column, Row } from "ui";
import { Drawer, Divider, Tag } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { createVisible } from "lib/effector-extensions/core/visible";
import { FormItem } from "ui/molecules";

import * as model from "../../model";

const visibleSettingsEditor = createVisible(false);

export const SettingsButton: React.FC = () => {
  const visible = useStore(visibleSettingsEditor.$value);

  return (
    <Pointer>
      <SettingOutlined onClick={() => visibleSettingsEditor.show()} />

      <Drawer
        placement="right"
        width="460px"
        closable={false}
        visible={visible}
        onClose={() => visibleSettingsEditor.hide()}
      >
        <SettingsEditor />
      </Drawer>
    </Pointer>
  );
};

const SettingsEditor: React.FC = () => {
  return (
    <Column>
      <h3>Settings</h3>
      <Divider orientation="left">Main</Divider>
      <SettingsEditorMain />
      <Divider orientation="left">Commit</Divider>
      <SettingsEditorCommit />
    </Column>
  );
};

const SettingsEditorMain: React.FC = () => {
  const workDir = useStore(model.$workDir);
  const defaultBranch = useStore(model.$defaultBranch);

  return (
    <Column>
      <FormItem title="Work directory">{workDir}</FormItem>
      <FormItem title="Default branch">{defaultBranch}</FormItem>
    </Column>
  );
};

const SettingsEditorCommit: React.FC = () => {
  return (
    <Column>
      <FormItem title="Types">
        <Types />
      </FormItem>
      <FormItem title="Scope root">
        <ScopeRoot />
      </FormItem>
      <FormItem title="Scope length">
        <ScopeLength />
      </FormItem>
    </Column>
  );
};

const Types: React.FC = () => {
  const types = useStore(model.$commitTypes);

  const list = types.map((type) => <Tag key={type}>{type}</Tag>);

  return <Row>{list}</Row>;
};

const ScopeRoot: React.FC = () => {
  const value = useStore(model.$commitScopeRoot);

  return <>{value}</>;
};

const ScopeLength: React.FC = () => {
  const value = useStore(model.$commitScopeLength);

  return <>{value}</>;
};
