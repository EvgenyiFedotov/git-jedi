import * as React from "react";
import styled from "styled-components";
import { Row } from "ui";
import { CommandsInput } from "features/commands";
import { PathRepo } from "features/path-repo";
import { BranchInput } from "features/branches";
import { Branch } from "lib/branch";
import { useStore } from "effector-react";

import { $mode, insertCommand } from "../model";

export const Header: React.FC = () => {
  const mode = useStore($mode);

  const toCommand = React.useCallback(() => {
    insertCommand();
  }, []);

  return (
    <Container>
      <PathRepo />
      <Branch if={mode === "command"}>
        <CommandsInput />
      </Branch>
      <Branch if={mode === "branch"}>
        <BranchInput onBlur={toCommand} onEsc={toCommand} />
      </Branch>
    </Container>
  );
};

const Container = styled(Row)`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 40px;
  padding: 8px;
  background-color: white;
  flex-wrap: nowrap;
`;
