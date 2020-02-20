import * as React from "react";
import {
  FileDiff,
  FileDiffChunk,
  FileDiffLine,
  FileDiffHeader,
} from "lib/api-git";
import styled from "styled-components";
import { cyan, red, grey, geekblue } from "@ant-design/colors";
import { DiffChunks } from "features/diff/ui/diff-chunks";
import { Branch } from "lib/branch";

type DiffType = "-" | "+";

export const DiffV2: React.FC<{
  fileDiff: FileDiff | null;
  type: DiffType;
}> = ({ fileDiff, type }) => {
  if (!fileDiff) return null;

  const chunks = fileDiff.chunks.map((diffChunk, index) => (
    <DiffChunk
      diffChunk={diffChunk}
      type={type}
      key={index}
      isLast={index === fileDiff.chunks.length - 1}
    />
  ));

  return (
    <DiffTable>
      <tbody>{chunks}</tbody>
    </DiffTable>
  );
};

const DiffChunk: React.FC<{
  diffChunk: FileDiffChunk;
  type: DiffType;
  isLast: boolean;
}> = ({ diffChunk, type, isLast }) => {
  const lines = diffChunk.lines.map((diffLine, index) => (
    <DiffLine diffLine={diffLine} type={type} key={index} />
  ));

  return (
    <>
      <DiffHeader diffHeader={diffChunk.header} />
      {lines}
      <Branch if={!isLast}>
        <tr>
          <td colSpan={2}></td>
        </tr>
      </Branch>
    </>
  );
};

const DiffHeader: React.FC<{ diffHeader: FileDiffHeader }> = ({
  diffHeader,
}) => {
  return (
    <tr>
      <Header colSpan={2}>
        {`@@ -${diffHeader.meta.remove.from},${diffHeader.meta.remove.length} +${diffHeader.meta.add.from},${diffHeader.meta.add.length} @@ ${diffHeader.title}`}
      </Header>
    </tr>
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
  width: 100%;

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
  width: 100%;
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

const Header = styled.td`
  background-color: ${geekblue[0]};
  font-weight: bold;
`;
