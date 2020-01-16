import * as React from "react";
import styled from "styled-components";
import { useList, useStore } from "effector-react";
import * as ui from "../ui";
import * as modelv2 from "../model-v2";
import { core } from "../../lib/api-git";
import * as managers from "../managers";
import { minus } from "react-icons-kit/feather/minus";
import { $isShowStatus } from "../state";

export const StatusPaths: React.FC = () => {
  const isShowStatus = useStore($isShowStatus);

  const rows = useList(modelv2.$status, statusPath => (
    <ui.ListRow>
      <ui.Row>
        <Status value={statusPath.status}>{statusPath.status}</Status>
        <div>{statusPath.path}</div>
      </ui.Row>

      <div>
        <ui.ButtonIcon
          icon={minus}
          onClick={() => modelv2.discardChanges(statusPath.path)}
        />
      </div>
    </ui.ListRow>
  ));

  return (
    <managers.Branch if={isShowStatus}>
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
  & > div > ${ui.ListRow} {
    justify-content: flex-start;
  }

  *:not(:last-child) {
    margin-bottom: 0;
  }
`;

interface StatusProps {
  value: core.StatusPath["status"];
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
