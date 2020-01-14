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

  return (
    <LogContainer>
      {Array.from(log.values()).map(log => (
        <Commit key={log.hash}>
          <ui.Row>
            <ui.ButtonLink
              onClick={() =>
                window.navigator.clipboard.writeText(hashSlice(log.hash))
              }
            >
              {hashSlice(log.hash)}{" "}
              {/* {hashSlice(log.parentHash[1]) || hashSlice(log.parentHash[0])} */}
            </ui.ButtonLink>

            <Refs hash={log.hash} />
          </ui.Row>

          <div>{log.note}</div>
        </Commit>
      ))}
    </LogContainer>
  );
};

const LogContainer = styled(ui.Column)`
  width: 100%;
  flex-direction: column-reverse;
`;

const Commit = styled(ui.ListRow)`
  &:hover {
    box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  }
`;

interface RefsProps {
  hash: string;
}

const Refs: React.FC<RefsProps> = props => {
  const refs = useStore($refs).refsByCommits.get(props.hash);

  const refList = refs
    ? Array.from(refs.values()).map(ref => {
        return <Ref key={ref.name} value={ref} />;
      })
    : [];

  return <ui.Row>{refList}</ui.Row>;
};

interface RefProps {
  value: gitApi.core.showRef.Ref;
}

const Ref: React.FC<RefProps> = ({ value }) => {
  return <RefContainer type={value.type}>{value.shortName}</RefContainer>;
};

interface RefContainerProps {
  type: gitApi.core.showRef.Ref["type"];
}

const RefContainer = styled.div<RefContainerProps>`
  border: 1px solid var(--bg-color);
  background-color: ${({ type }) => {
    switch (type) {
      case "heads":
        return "var(--ref-branch-color)";
      default:
        return "var(--ref-color)";
    }
  }};
  border-radius: 3px;
  padding: 0 0.5rem;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  }

  ${Commit}:hover & {
    border-color: ${({ type }) => {
      switch (type) {
        case "heads":
          return "var(--ref-branch-border-color)";
        default:
          return "var(--ref-border-color)";
      }
    }};
  }
`;
