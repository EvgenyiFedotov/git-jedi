import styled from "styled-components";

import * as css from "./css";
export { css };

export const Row = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  flex-wrap: wrap;
  min-height: 1.5rem;

  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const Column = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;
