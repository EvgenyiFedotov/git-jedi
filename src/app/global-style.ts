import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: #fafafa;
    --main-color: #424242;
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
    font-size: 14px;
    background-color: var(--bg-color);
    color: var(--main-color);
    overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-weight: 300;
  }

  #app {
    height: 100%;
  }
`;
