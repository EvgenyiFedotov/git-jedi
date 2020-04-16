import * as React from "react";
import { useStore } from "effector-react";
import { useMount } from "lib/effector-extensions/react/use-mount";
import { FullCenterFlex, LinkBlock } from "ui";
import { Button } from "antd";

import * as model from "./model";
import { WordDirContainer } from "./ui";

const $workDirCut = model.$workDir.map((cwd) => {
  const cwdArr = (cwd || "").split("/");

  return `${cwdArr[cwdArr.length - 2]}/${cwdArr[cwdArr.length - 1]}`;
});

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
