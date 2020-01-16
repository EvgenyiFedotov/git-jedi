import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as model from "../model";
import * as modelv2 from "../model-v2";
import * as managers from "../managers";
import * as ui from "../ui";

export const Status: React.FC = () => {
  const isChanged = useStore(modelv2.$isChanged);
  const isShowStatusPaths = useStore(model.$isShowStatusPaths);

  return (
    <StatusContainer>
      <managers.Branch if={isChanged}>
        <ui.ButtonLink
          onClick={() => model.showStatusPaths(!isShowStatusPaths)}
        >
          Changed
        </ui.ButtonLink>
        <>Not changed</>
      </managers.Branch>
    </StatusContainer>
  );
};

const StatusContainer = styled.div``;
