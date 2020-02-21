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
import { Icon, Tooltip } from "antd";

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
    <DiffHeaderContainer>
      <AddLine>
        <Tooltip title="Add chunk">
          <Icon type="plus" />
        </Tooltip>
      </AddLine>
      <NumLine></NumLine>
      <td>
        {`@@ -${diffHeader.meta.remove.from},${diffHeader.meta.remove.length} +${diffHeader.meta.add.from},${diffHeader.meta.add.length} @@ ${diffHeader.title}`}
      </td>
    </DiffHeaderContainer>
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
    <DiffLineContainer>
      <AddLine>
        <Branch if={showLine && !!paintColorCode}>
          <Tooltip title="Add line">
            <Icon type="plus" />
          </Tooltip>
        </Branch>
      </AddLine>
      <NumLine>
        <Branch if={showLine}>{numLine}</Branch>
      </NumLine>
      <Code type={paintColorCode}>
        <Branch if={showLine}>
          {/* <DiffChunks diffLine={diffLine} mode={type} /> */}
        </Branch>
      </Code>
    </DiffLineContainer>
  );
};

const DiffTable = styled.table`
  font-family: monospace;
  font-size: small;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  position: relative;

  tr {
    height: 21px;

    td {
      padding: 0 4px;
    }
  }
`;

const DiffHeaderContainer = styled.tr`
  td {
    background-color: ${geekblue[0]};
    font-weight: bold;
  }
`;

const AddLine = styled.td`
  cursor: pointer;
  color: ${grey[2]};
  position: absolute;
  left: 0;
  /* position: sticky;
  left: 0; */
  background-color: white;
`;

const DiffLineContainer = styled.tr``;

const NumLine = styled.td`
  color: ${grey[0]};
  white-space: nowrap;
  text-align: right;
  /* position: sticky; */
  /* left: 20px; */
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
