import * as React from "react";
import styled from "styled-components";
import { execSync } from "child_process";

import * as gitApi from "../lib/git-api";
import { GlobalStyle } from "./global-style";
import * as ui from "./ui";

export const App = () => {
  const log = gitApi.core.log.get();

  const branchRefs = gitApi.layout.log.getBranchRefs(log);

  const allRefs = gitApi.layout.log.getAllRefs();

  console.log(branchRefs);
  console.log(allRefs);

  return (
    <>
      <GlobalStyle />

      <Container>
        <Log log={log} />

        <Bottom>
          <Branches>
            <Branch>Master</Branch>
            <Branch>Next</Branch>
            <Branch>Next-2</Branch>
          </Branches>

          <InputMessage />
        </Bottom>
      </Container>
    </>
  );
};

const Container = styled(ui.Column)`
  height: 100%;
  position: relative;
  justify-content: space-between;
`;

const Bottom = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: var(--bg-color);
`;

interface LogProps {
  log: gitApi.core.log.Log;
}

const Log: React.FC<LogProps> = props => {
  return (
    <LogContainer>
      {Array.from(props.log.values()).map(log => (
        <Commit key={log.hash}>
          <ui.Row>
            <div>
              {log.hash} {log.parentHash}
            </div>

            <Refs refs={log.refs} />
          </ui.Row>

          <div>{log.note}</div>
        </Commit>
      ))}
    </LogContainer>
  );
};

const LogContainer = styled(ui.Column)`
  width: 100%;
`;

const Commit = styled(ui.Row)`
  padding: 0.5rem;
  cursor: pointer;
  justify-content: space-between;

  &:hover {
    box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  }
`;

interface RefsProps {
  refs: gitApi.core.log.Refs;
}

const Refs: React.FC<RefsProps> = props => {
  const refs = Array.from(props.refs.values()).map(ref => {
    return <Ref key={ref.value}>{ref.value}</Ref>;
  });

  return <RefsContainer>{refs}</RefsContainer>;
};

const RefsContainer = styled(ui.Row)``;

const Ref = styled.div``;

const InputMessage: React.FC = () => {
  return (
    <InputMessageContainer>
      <CurrentBranch>Master</CurrentBranch>

      <Input />

      <ButtonSend onClick={() => {}}>Send</ButtonSend>
    </InputMessageContainer>
  );
};

const InputMessageContainer = styled(ui.Row)`
  width: 100%;
  flex-wrap: nowrap;
  padding: 0.5rem;
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
  background-color: var(--bg-color);
`;

const CurrentBranch = styled.div``;

const Input = styled.input`
  width: 100%;
  border: 1px solid var(--main-color);
  background-color: var(--bg-color);
  padding: 0.1rem 0.25rem;
  line-height: 1rem;
  border-radius: 2px;
`;

const ButtonSend = styled.button`
  border: 1px solid var(--main-color);
  background-color: var(--bg-color);
  padding: 0.1rem 0.25rem;
  line-height: 1rem;
  border-radius: 2px;
  cursor: pointer;
`;

const Branches = styled.div`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const Branch = styled.div`
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: var(--main-3-color);
  }
`;
