import * as React from "react";
import styled from "styled-components";
import * as ui from "../ui";
import { exec } from "../../lib/git-api/core/exec";

export const Exec: React.FC = () => {
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
      <ui.Input
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

      <ui.Button onClick={runExec}>Send</ui.Button>
    </ExecContainer>
  );
};

const ExecContainer = styled(ui.Panel)`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
`;
