import * as React from "react";

import * as ui from "./ui";

interface Props {
  list: string[];
  onClickBranch?: (nameBranch: string) => void;
}

export const Branches: React.FC<Props> = props => {
  const { onClickBranch = () => {} } = props;

  return (
    <ui.Row>
      {props.list.map(nameBranch => {
        return (
          <ui.Label key={nameBranch} onClick={() => onClickBranch(nameBranch)}>
            {nameBranch}
          </ui.Label>
        );
      })}
    </ui.Row>
  );
};