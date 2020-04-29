import styled from "styled-components";
import { RowBase, Column } from "ui";

export const UiApp = styled.div`
  background-color: var(--bg-color);
  padding: 0 8px;
  width: 100%;
  height: 100%;
`;

export const UiContent = styled(Column)``;

export const UiFooter = styled(RowBase)`
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 24px;
  padding: 0 8px;
  background-color: var(--bg-color);
  border-top: 1px solid var(--bg-border-color);
`;
