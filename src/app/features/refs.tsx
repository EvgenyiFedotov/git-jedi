import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as ui from "../ui";
import { $refs } from "../model";

export const Refs: React.FC = () => {
  const refs = useStore($refs);

  return (
    <RefsContainer>
      {Array.from(refs.values()).map(ref => (
        <Ref key={ref.name}>{ref.shortName}</Ref>
      ))}
    </RefsContainer>
  );
};

const RefsContainer = styled.div`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-top: 1px solid var(--panel-boder-color);
  max-height: 10rem;
  overflow-y: auto;
`;

const Ref = styled(ui.Row)`
  padding: 0.5rem;
  cursor: pointer;
  min-height: 2.5rem;
  align-items: center;

  &:hover {
    background-color: var(--main-3-color);
  }
`;
