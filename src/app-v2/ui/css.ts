import { css } from "styled-components";

export const block = css`
  padding: 1rem;
`;

export const appFixBlock = css`
  ${block};
  width: 100%;
  padding: 1rem;
  height: 3.5rem;
  position: fixed;
  z-index: 100;
  background-color: white;
  display: flex;
  align-content: center;
`;
