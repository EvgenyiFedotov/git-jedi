import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: #f7f7f7;
    --main-color: #363645;
    --main-1-color: #959087;
    --main-2-color: #d1cdc9;
    --main-3-color: #cad0f1;
    --panel-boder-color: #f1f1ff;
    --ref-color: #bbc6ff;
    --ref-branch-color: #9eafff;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-color: #363645;
      --main-color: #f7f7f7;
      --main-3-color: #485079;
      --panel-boder-color: #3d3d4e;
      --ref-color: #485079;
      --ref-branch-color: #5a68ab;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
    line-height: 1.2rem;
  }

  html, body {
    height: 100%;
  }

  body {
    font-size: 14px;
    background-color: var(--bg-color);
    color: var(--main-color);
    overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-weight: 300;
    position: relative;
  }

  #app {
    height: 100%;
  }
`;
