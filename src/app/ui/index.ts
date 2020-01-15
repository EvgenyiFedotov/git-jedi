import styled from "styled-components";
import { Icon } from "react-icons-kit";

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

export const ListRow = styled(Row)`
  padding: 0.5rem 1rem;
  cursor: pointer;
  justify-content: space-between;
  flex-wrap: nowrap;
  min-height: 2.5rem;

  &:hover {
    background-color: var(--list-row-hover);
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
  background-color: transparent;
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
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
`;

export const PanelTop = styled(Panel)`
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-bottom: 1px solid var(--panel-boder-color);
`;

export const PanelBottom = styled(Panel)`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-top: 1px solid var(--panel-boder-color);
`;

export const ButtonLink = styled.button`
  background-color: transparent;
  padding: 0.1rem 0.5rem;
  line-height: 1.5rem;
  font-size: 0.9rem;
  font-weight: 300;
  cursor: pointer;
  color: var(--main-color);
  border: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const ButtonIcon = styled(Icon)`
  line-height: 1rem;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;

  &:hover {
    background-color: var(--button-icon-hover-color);
  }
`;
