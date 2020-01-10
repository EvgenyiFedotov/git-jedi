import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: #f7f7f7;
    --main-color: #30303b;
    --main-1-color: #959087;
    --main-2-color: #d1cdc9;
    --main-3-color: #eae9e7;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
    line-height: 1.2rem;
  }

  html, body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  body {
    --bg-color: #30303b;
    --main-color: #f7f7f7;
    --main-3-color: #795548;
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
