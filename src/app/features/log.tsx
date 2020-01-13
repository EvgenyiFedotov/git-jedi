import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as gitApi from "../../lib/git-api";
import * as ui from "../ui";
import { $log, $refs } from "../model";

type HashSlice = (hash: string) => string;

const hashSlice: HashSlice = hash => {
  return hash && hash.slice(0, 6);
};

export const Log: React.FC = () => {
  const log = useStore($log);

  console.log($refs.getState());

  return (
    <LogContainer>
      {Array.from(log.values()).map(log => (
        <Commit key={log.hash}>
          <ui.Row>
            <div>
              {hashSlice(log.hash)}{" "}
              {hashSlice(log.parentHash[1]) || hashSlice(log.parentHash[0])}
            </div>

            <Refs hash={log.hash} />
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
  flex-wrap: nowrap;

  &:hover {
    box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
    background-color: var(--main-3-color);
  }
`;

interface RefsProps {
  hash: string;
}

const Refs: React.FC<RefsProps> = props => {
  const refs = useStore($refs).refsByCommits.get(props.hash);

  const refList = refs
    ? Array.from(refs.values()).map(ref => {
        return <div key={ref.name}>{ref.shortName}</div>;
      })
    : [];

  return <ui.Row>{refList}</ui.Row>;
};
