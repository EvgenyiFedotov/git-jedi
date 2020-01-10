import * as React from "react";
import styled from "styled-components";
import { createStore, createEvent, forward } from "effector";
import { useStore } from "effector-react";
import { execSync } from "child_process";

import * as gitApi from "../lib/git-api";
import { GlobalStyle } from "./global-style";
import * as ui from "./ui";
import * as managers from "./managers";

const $allRefs = createStore<gitApi.core.log.Refs>(
  gitApi.layout.log.getAllRefs()
);

const $showedBranches = createStore<boolean>(false);

const showBranches = createEvent<boolean>();

forward({
  from: showBranches,
  to: $showedBranches
});

export const App = () => {
  const log = gitApi.core.log.get();

  return (
    <>
      <GlobalStyle />

      <Container>
        <Top>
          <Exec />
        </Top>

        <Log log={log} />

        <Bottom>
          <managers.Branch if={useStore($showedBranches)}>
            <Branches />
          </managers.Branch>

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

const Top = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: var(--bg-color);
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

const LogContainer = styled.div`
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
  const showedBranches = useStore($showedBranches);

  return (
    <InputMessageContainer>
      <CurrentBranch onClick={() => showBranches(!showedBranches)}>
        {gitApi.core.revParse.getCurrentBranch()}
      </CurrentBranch>

      <Input />

      <ButtonSend onClick={() => {}}>Send</ButtonSend>
    </InputMessageContainer>
  );
};

const Panel = styled(ui.Row)`
  width: 100%;
  flex-wrap: nowrap;
  padding: 0.5rem;
  background-color: var(--bg-color);
`;

const InputMessageContainer = styled(Panel)`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const CurrentBranch = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

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

const Branches: React.FC = () => {
  const allRefs = Array.from($allRefs.getState().values());

  return (
    <BranchesContainer>
      {allRefs.map(ref => (
        <Branch
          key={ref.value}
          onClick={() => {
            showBranches(false);
          }}
        >
          {ref.value}
        </Branch>
      ))}
    </BranchesContainer>
  );
};

const BranchesContainer = styled.div`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const Branch = styled(ui.Row)`
  padding: 0.5rem;
  cursor: pointer;
  min-height: 2.5rem;
  align-items: center;

  &:hover {
    background-color: var(--main-3-color);
  }
`;

const Exec: React.FC = () => {
  const [value, setValue] = React.useState<string>("");
  const input = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  const runExec = () => {
    console.log(execSync(value).toString());
  };

  return (
    <ExecContainer>
      <Input
        ref={input}
        value={value}
        onChange={event => setValue(event.currentTarget.value)}
        onKeyPress={event => {
          if (event.key === "Enter") {
            runExec();
          }
        }}
      />

      <ButtonSend onClick={runExec}>Send</ButtonSend>
    </ExecContainer>
  );
};

const ExecContainer = styled(Panel)`
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;
