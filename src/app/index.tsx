import * as React from "react";
import styled from "styled-components";

import * as gitApi from "../lib/git-api";
import { Branches } from "./branches";
import { GlobalStyle } from "./global-style";
import * as ui from "./ui";
import { Branch } from "./managers";

export const App = () => {
  const log = gitApi.core.log.get();

  console.log(log);

  return (
    <>
      <GlobalStyle />

      <Container>
        <Log log={log} />
      </Container>
    </>
  );
};

const Container = styled(ui.Column)`
  align-items: center;
`;

const Header = styled(ui.Row)`
  width: 100%;
  background-color: var(--main-color);
  color: var(--bg-color);
  padding: 0.5rem;
  padding-top: 16px;
  justify-content: space-between;
`;

const Message = styled(ui.Column)`
  border: 1px solid var(--main-color);
  border-radius: 3px;
  padding: 0.5rem;
`;

const LinkBack = styled(ui.Link)`
  color: var(--bg-color);
`;

interface LogProps {
  log: gitApi.core.log.Log;
}

const Log: React.FC<LogProps> = props => {
  return (
    <LogContainer>
      {Array.from(props.log.values()).map(log => (
        <Commit key={log.hash}>
          {log.hash} {log.parentHash} [{log.refs.join(" / ")}] {log.note}
        </Commit>
      ))}
    </LogContainer>
  );
};

const LogContainer = styled(ui.Column)``;

const Commit = styled(ui.Column)``;
