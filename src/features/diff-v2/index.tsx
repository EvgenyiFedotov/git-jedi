import * as React from "react";
import { FileDiff, FileDiffChunk, FileDiffLine } from "lib/api-git";
import styled from "styled-components";
import { cyan, red, grey } from "@ant-design/colors";
import { DiffChunks } from "features/diff/ui/diff-chunks";
import { Branch } from "lib/branch";

type DiffType = "-" | "+";

export const DiffV2: React.FC<{
  fileDiff: FileDiff | null;
  type: DiffType;
}> = ({ fileDiff, type }) => {
  if (!fileDiff) return null;

  const chunks = fileDiff.chunks.map((diffChunk, index) => (
    <DiffChunk diffChunk={diffChunk} type={type} key={index} />
  ));

  return (
    <DiffTable>
      <tbody>{chunks}</tbody>
    </DiffTable>
  );
};

const DiffChunk: React.FC<{ diffChunk: FileDiffChunk; type: DiffType }> = ({
  diffChunk,
  type,
}) => {
  const lines = diffChunk.lines.map((diffLine, index) => (
    <DiffLine diffLine={diffLine} type={type} key={index} />
  ));

  return (
    <>
      {lines}
      <tr>
        <td colSpan={2}></td>
      </tr>
    </>
  );
};

const DiffLine: React.FC<{
  diffLine: FileDiffLine;
  type: DiffType;
}> = ({ diffLine, type }) => {
  const showLine = React.useMemo(() => {
    switch (type) {
      case "-":
        return diffLine.remove || diffLine.spase;
      case "+":
        return diffLine.add || diffLine.spase;
    }
  }, [diffLine, type]);

  const numLine = React.useMemo(() => {
    switch (type) {
      case "-":
        return diffLine.removeNumLine;
      case "+":
        return diffLine.addNumLine;
    }
  }, [diffLine, type]);

  const paintColorCode = React.useMemo(() => {
    if (diffLine.remove && type === "-") {
      return type;
    }

    if (diffLine.add && type === "+") {
      return type;
    }

    return null;
  }, [type]);

  return (
    <tr>
      <NumLine>
        <Branch if={showLine}>{numLine}</Branch>
      </NumLine>
      <Code type={paintColorCode}>
        <Branch if={showLine}>
          <DiffChunks diffLine={diffLine} type={type} />
        </Branch>
      </Code>
    </tr>
  );
};

const DiffTable = styled.table`
  font-family: monospace;
  font-size: small;
  display: block;
  overflow-x: auto;
  white-space: nowrap;

  tr {
    height: 21px;

    td {
      padding: 0 4px;
    }
  }
`;

const NumLine = styled.td`
  color: ${grey[0]};
  white-space: nowrap;
  text-align: right;
  position: sticky;
  left: 0;
  background-color: white;
`;

const Code = styled.td<{ type: DiffType | null }>`
  white-space: pre;
  background-color: ${({ type }) => {
    switch (type) {
      case "-":
        return red[0];
      case "+":
        return cyan[0];
    }
  }};
`;
