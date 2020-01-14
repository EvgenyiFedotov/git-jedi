import * as React from "react";
import styled from "styled-components";
import { useList, useStore } from "effector-react";
import * as ui from "../ui";
import * as model from "../model";
import { core } from "../../lib/git-api";
import * as managers from "../managers";

export const StatusPaths: React.FC = () => {
  const isShowStatusPaths = useStore(model.$isShowStatusPaths);

  const rows = useList(model.$statusPaths, statusPath => (
    <ui.ListRow>
      <Status value={statusPath.status}>{statusPath.status}</Status>
      <div>{statusPath.path}</div>
    </ui.ListRow>
  ));

  return (
    <managers.Branch if={isShowStatusPaths}>
      <StatusPathsContainer>
        <List>{rows}</List>
      </StatusPathsContainer>
    </managers.Branch>
  );
};

const StatusPathsContainer = styled.div`
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-bottom: 1px solid var(--panel-boder-color);
  max-height: 10rem;
  overflow-y: auto;
`;

const List = styled(ui.Column)`
  & > ${ui.ListRow} {
    justify-content: flex-start;
  }
`;

interface StatusProps {
  value: core.status.StatusPath["status"];
}

const Status = styled.div<StatusProps>`
  color: ${({ value }) => {
    switch (value) {
      case "untracked":
        return "var(--status-path-untracked)";
      case "deleted":
        return "var(--status-path-deleted)";
      default:
        return "var(--status-path-default)";
    }
  }};
  text-transform: capitalize;
`;
