import styled from "styled-components";

export const Label = styled.div`
  cursor: pointer;
  padding: 0 0.3rem;
  border-radius: 3px;
  background-color: var(--main-color);
  color: var(--bg-color);
  font-size: 0.8rem;
`;

export const Link = styled.div`
  cursor: pointer;
  color: var(--main-color);
`;

export const Row = styled.div`
  display: flex;
  flex: 1 0;
  align-items: center;
  flex-wrap: wrap;
  min-height: 1.5rem;

  & > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const Column = styled.div`
  display: flex;
  flex: 1 0;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;
