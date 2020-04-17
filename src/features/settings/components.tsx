import * as React from "react";
import { useStore } from "effector-react";
import { useMount } from "lib/effector-extensions/react/use-mount";
import { FullCenterFlex, LinkBlock, Pointer, Column } from "ui";
import { Button, Drawer, Divider } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { createVisible } from "lib/effector-extensions/core/visible";
import { FormItem } from "ui/molecules";

import * as model from "./model";
import { WordDirContainer } from "./ui";

const $workDirCut = model.$workDir.map((cwd) => {
  const cwdArr = (cwd || "").split("/");

  return `${cwdArr[cwdArr.length - 2]}/${cwdArr[cwdArr.length - 1]}`;
});

const visibleSettingsEditor = createVisible();

export const Settings: React.FC = ({ children }) => {
  useMount(model.init);

  return (
    <StatusReading>
      <CheckWorkDir>{children}</CheckWorkDir>
    </StatusReading>
  );
};

const StatusReading: React.FC = ({ children }) => {
  const status = useStore(model.$statusReading);

  if (status === "done") {
    return <>{children}</>;
  }

  return <FullCenterFlex>Reading settings...</FullCenterFlex>;
};

const CheckWorkDir: React.FC = ({ children }) => {
  const wordDir = useStore(model.$workDir);

  if (wordDir) {
    return <>{children}</>;
  }

  return (
    <FullCenterFlex>
      <Button type="primary" onClick={() => model.openDialogSelectWorkDir()}>
        Select path repo
      </Button>
    </FullCenterFlex>
  );
};

export const WordDir: React.FC = () => {
  const workDirCut = useStore($workDirCut);

  return (
    <LinkBlock>
      <WordDirContainer onClick={() => model.openDialogSelectWorkDir()}>
        {workDirCut}
      </WordDirContainer>
    </LinkBlock>
  );
};

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
      <FormItem title="Types" />
      <FormItem title="Scope root" />
      <FormItem title="Scope length" />
    </Column>
  );
};
