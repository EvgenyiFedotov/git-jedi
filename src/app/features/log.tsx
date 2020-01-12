import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as gitApi from "../../lib/git-api";
import * as ui from "../ui";
import { $log } from "../model";

export const Log: React.FC = () => {
  const log = useStore($log);

  return (
    <LogContainer>
      {Array.from(log.values()).map(log => (
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
    return <div key={ref.name}>{ref.name}</div>;
  });

  return <ui.Row>{refs}</ui.Row>;
};
