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

export const Input = styled.input`
  width: 100%;
  border: 1px solid var(--main-color);
  background-color: var(--bg-color);
  padding: 0.1rem 0.5rem;
  line-height: 1.5rem;
  font-size: 0.9rem;
  font-weight: 300;
  border-radius: 2px;
  color: var(--main-color);
`;

export const Button = styled.button`
  border: 1px solid var(--main-color);
  background-color: var(--bg-color);
  padding: 0.1rem 0.5rem;
  line-height: 1.5rem;
  font-size: 0.9rem;
  font-weight: 300;
  border-radius: 2px;
  cursor: pointer;
  color: var(--main-color);
`;

export const Panel = styled(Row)`
  width: 100%;
  flex-wrap: nowrap;
  padding: 0.5rem;
  background-color: var(--bg-color);
`;
