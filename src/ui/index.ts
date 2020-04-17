import styled from "styled-components";
import { blue } from "@ant-design/colors";

export const RowBase = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  flex-wrap: wrap;
  min-height: 24px;
`;

export const Row = styled(RowBase)<{ bottom?: boolean }>`
  & > *:last-child {
    margin-bottom: ${({ bottom }) => (bottom ? "8px" : "0px")};
  }

  & > *:not(:last-child) {
    margin-bottom: ${({ bottom }) => (bottom ? "8px" : "0px")};
    margin-right: 8px;
  }
`;

export const RowPadding = styled(Row)`
  padding: 0 8px;
`;

export const Column = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const CenterFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
`;

export const FullCenterFlex = styled(CenterFlex)`
  width: 100%;
  height: 100%;
`;

export const LinkBlock = styled.div`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const RowHover = styled(Row)`
  width: 100%;
  justify-content: space-between;
  cursor: default;

  &:hover {
    background-color: ${blue[0]};
  }
`;

export const Monospace = styled.div<{ color?: string }>`
  font-family: monospace;
  color: ${({ color }) => color};
`;

export const Pointer = styled.div`
  cursor: pointer;
`;
