import * as React from "react";
import { Button, Input } from "antd";
import { useStore } from "effector-react";

import { Branch } from "lib/branch";
import { useMousetrap } from "lib/use-mousetrap";

import {
  $nameBranch,
  changeNameBranch,
  createBranch,
  $isShowButton,
  showButton,
  hideButton,
} from "./model";

export const CreateBranch: React.FC = () => {
  const isShowButton = useStore($isShowButton);
  const nameBranch = useStore($nameBranch);

  const { ref } = useMousetrap("command+enter", createBranch);

  return (
    <div>
      <Branch if={isShowButton}>
        <Button
          size="small"
          title="Create branch"
          style={{ width: "104px" }}
          onClick={hideButton}
        >
          Create branch
        </Button>
        <Input
          placeholder="Name branch (⌘Enter)"
          style={{ width: "164px" }}
          size="small"
          onBlur={showButton}
          autoFocus={true}
          ref={ref}
          value={nameBranch}
          onChange={changeNameBranch}
        />
      </Branch>
    </div>
  );
};
