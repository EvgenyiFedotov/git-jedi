import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as modelv2 from "../model-v2";
import * as managers from "../managers";
import * as ui from "../ui";
import { $isShowStatus, showStatus } from "../state";

export const Status: React.FC = () => {
  const isChanged = useStore(modelv2.$isChanged);
  const isShowStatus = useStore($isShowStatus);

  return (
    <StatusContainer>
      <managers.Branch if={isChanged}>
        <ui.ButtonLink onClick={() => showStatus(!isShowStatus)}>
          Changed
        </ui.ButtonLink>
        <>Not changed</>
      </managers.Branch>
    </StatusContainer>
  );
};

const StatusContainer = styled.div``;
