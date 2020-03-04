import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  flex-wrap: wrap;
  min-height: 24px;

  & > *:not(:last-child) {
    margin-right: 8px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`;
