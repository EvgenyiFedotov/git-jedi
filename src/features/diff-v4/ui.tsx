import * as React from "react";
import { diffV2 } from "lib/api-git";
import styled from "styled-components";
import { cyan, red, grey, geekblue } from "@ant-design/colors";

import { Mode } from "./types";

export const Separator: React.FC = () => (
  <tr>
    <td></td>
  </tr>
);

export const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-wrap: nowrap;
`;

export const Table = styled.table`
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

export const InfoLines = styled(Table)``;

export const Lines = styled(Table)`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
`;

export const Header = styled.tr`
  background-color: ${geekblue[0]};
  font-weight: bold;

  td[data-type="title"] {
    width: 100vw;
  }
`;

export const AddButton = styled.td`
  cursor: pointer;
  color: ${grey[2]};
`;

export const Num = styled.td<{ bgColor?: string }>`
  color: ${grey[0]};
  text-align: right;
  background-color: ${({ bgColor }) => bgColor};
`;

export const Code = styled.td<{ bgColor?: string }>`
  width: 100%;
  white-space: pre !important;
  background-color: ${({ bgColor }) => bgColor};
`;

export const Chunk = styled.span<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  padding: 3px 2px;
`;

export function getBgColor(diffLine: diffV2.DiffLine, mode: Mode) {
  const modeLine = diffLine[mode];

  if (!!modeLine && diffLine.changed) {
    if (diffLine.remove && mode === "remove") {
      return red[0];
    }

    if (diffLine.add && mode === "add") {
      return cyan[0];
    }
  }
}
