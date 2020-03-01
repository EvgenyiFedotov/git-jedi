import { css } from "styled-components";

export const heightLine = 24; // px
export const padding = 16; // px

export const block = css`
  padding: ${padding}px;
`;

export const appFixBlock = css`
  ${block};
  width: 100%;
  height: calc(${heightLine}px + ${padding * 2}px);
  position: fixed;
  z-index: 100;
  background-color: white;
  display: flex;
`;
