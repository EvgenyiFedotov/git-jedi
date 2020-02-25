import styled from "styled-components";
import { geekblue } from "@ant-design/colors";

export const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-wrap: nowrap;
`;

export const Lines = styled.table`
  font-family: monospace;
  font-size: small;
  display: block;

  tr {
    height: 21px;

    td {
      white-space: nowrap;
      padding: 0 4px;
    }
  }
`;

export const CodeLines = styled(Lines)`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
`;

export const HeaderLine = styled.tr`
  background-color: ${geekblue[0]};
  font-weight: bold;

  td[data-type="title"] {
    width: 100vw;
  }
`;

export const CodeLine = styled.tr<{ bgColor?: string }>`
  td {
    width: 100%;
    white-space: pre !important;
    background-color: ${({ bgColor }) => bgColor};
  }
`;

export const CodeLineChunk = styled.span<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  padding: 3px 2px;
`;
