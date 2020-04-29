import "normalize.css";
import { createGlobalStyle } from "styled-components";

export const Style = createGlobalStyle`
  :root {
    --bg-color: #FFFFFF;
    --bg-border-color: #f5f5f5;
  }

  html, body, #app {
    width: 100%;
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }
`;
