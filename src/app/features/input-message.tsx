import * as React from "react";
import { useStore } from "effector-react";
import * as ui from "../ui";
import { $currentBranch } from "../model-v2";
import { $isShowBranches, showBranches } from "../state";

export const InputMessage: React.FC = () => {
  const isShowBranches = useStore($isShowBranches);
  const currentBranch = useStore($currentBranch);

  return (
    <ui.PanelBottom>
      <ui.ButtonLink onClick={() => showBranches(!isShowBranches)}>
        {currentBranch}
      </ui.ButtonLink>

      <ui.Input />

      <ui.Button onClick={() => {}}>Send</ui.Button>
    </ui.PanelBottom>
  );
};
