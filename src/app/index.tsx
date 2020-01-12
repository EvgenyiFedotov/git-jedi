import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as electron from "electron";

import * as gitApi from "../lib/git-api";
import { GlobalStyle } from "./global-style";
import * as ui from "./ui";
import * as managers from "./managers";
import { exec } from "../lib/git-api/core/exec";

import {
  $path,
  $branches,
  changePath,
  $log,
  $showedBranches,
  showBranches
} from "./model";

const { dialog } = electron.remote;

export const App = () => {
  return (
    <>
      <GlobalStyle />

      <Container>
        <Top>
          <Path />
        </Top>

        <Log log={useStore($log)} />

        <Bottom>
          <managers.Branch if={useStore($showedBranches)}>
            <Branches />
          </managers.Branch>

          <InputMessage />
          <Exec />
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
  log: gitApi.core.types.Log;
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
    background-color: var(--main-3-color);
  }
`;

interface RefsProps {
  refs: gitApi.core.types.Refs;
}

const Refs: React.FC<RefsProps> = props => {
  const refs = Array.from(props.refs.values()).map(ref => {
    return <Ref key={ref.name}>{ref.name}</Ref>;
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
  padding: 0.1rem 0.5rem;
  line-height: 1.5rem;
  font-size: 0.9rem;
  font-weight: 300;
  border-radius: 2px;
  color: var(--main-color);
`;

const ButtonSend = styled.button`
  border: 1px solid var(--main-color);
  background-color: var(--bg-color);
  padding: 0.1rem 0.5rem;
  line-height: 1.5rem;
  font-size: 0.9rem;
  font-weight: 300;
  border-radius: 2px;
  cursor: pointer;
  color: var(--main-color);
`;

const Branches: React.FC = () => {
  const branches = useStore($branches);

  return (
    <BranchesContainer>
      {Array.from(branches.values()).map(branch => (
        <Branch
          key={branch.name}
          onClick={() => {
            showBranches(false);
          }}
        >
          {branch.name}
        </Branch>
      ))}
    </BranchesContainer>
  );
};

const BranchesContainer = styled.div`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
  max-height: 10rem;
  overflow-y: auto;
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
  const HISTORY_COMMAND_LINE = localStorage.getItem("HISTORY_COMMAND_LINE");
  const [history, setHistory] = React.useState<string[]>(
    HISTORY_COMMAND_LINE ? (JSON.parse(HISTORY_COMMAND_LINE) as string[]) : []
  );
  const [historyIndex, setHistoryIndex] = React.useState<number>(
    history.length
  );
  const input = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  const runExec = () => {
    setHistory(prev => {
      if (prev[prev.length - 1] === value) {
        return prev;
      }

      const next = [...prev, value];

      localStorage.setItem("HISTORY_COMMAND_LINE", JSON.stringify(next));

      setHistoryIndex(next.length - 1);

      return next;
    });

    console.log(exec(value).toString());
  };

  React.useEffect(() => {
    if (history[historyIndex]) {
      setValue(history[historyIndex]);
    } else if (historyIndex === history.length) {
      setValue("");
    }
  }, [historyIndex]);

  return (
    <ExecContainer>
      <Input
        ref={input}
        value={value}
        onChange={event => setValue(event.currentTarget.value)}
        onKeyUp={event => {
          if (event.key === "Enter") {
            runExec();
          } else if (event.key === "ArrowUp") {
            if (historyIndex > 0) {
              setHistoryIndex(prev => prev - 1);
            }
          } else if (event.key === "ArrowDown") {
            if (historyIndex <= history.length - 1) {
              setHistoryIndex(prev => prev + 1);
            }
          }
        }}
      />

      <ButtonSend onClick={runExec}>Send</ButtonSend>
    </ExecContainer>
  );
};

const ExecContainer = styled(Panel)`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const Path: React.FC = () => {
  return (
    <PathContainer>
      <div>Path:</div>
      <PathValue
        onClick={() => {
          dialog
            .showOpenDialog({
              properties: ["openDirectory"],
              defaultPath: $path.getState()
            })
            .then(result => {
              const {
                canceled,
                filePaths: [nextPath]
              } = result;

              if (canceled === false) {
                changePath(nextPath);
              }
            });
        }}
      >
        {useStore($path)}
      </PathValue>
    </PathContainer>
  );
};

const PathContainer = styled(Panel)`
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const PathValue = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
