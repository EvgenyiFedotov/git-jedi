import * as React from "react";
import { useStore } from "effector-react";
import { LinkBlock } from "ui";

import { WordDirContainer } from "./ui";
import { $workDir, openDialogSelectWorkDir } from "../../model";

const $workDirCut = $workDir.map((cwd) => {
  const cwdArr = (cwd || "").split("/");

  return `${cwdArr[cwdArr.length - 2]}/${cwdArr[cwdArr.length - 1]}`;
});

export const WordDir: React.FC = () => {
  const workDirCut = useStore($workDirCut);

  return (
    <LinkBlock>
      <WordDirContainer onClick={() => openDialogSelectWorkDir()}>
        {workDirCut}
      </WordDirContainer>
    </LinkBlock>
  );
};
