import "normalize.css";
import styled, { createGlobalStyle } from "styled-components";
import { RowBase } from "ui";

export const Style = createGlobalStyle`
  :root {
    --bg-color: #FFFFFF;
    --bg-border-color: #f5f5f5;
  }

  * {
    box-sizing: border-box;
  }
`;

export const AppContainer = styled.div`
  background-color: var(--bg-color);
  padding: 0 8px;
`;

export const FooterContainer = styled(RowBase)`
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
