import * as React from "react";
import { diffV2 } from "lib/api-git";
import styled from "styled-components";
import { cyan, red, grey, geekblue } from "@ant-design/colors";
import { Icon, Tooltip } from "antd";
import { Branch } from "lib/branch";

type Mode = "remove" | "add";

export const DiffV4: React.FC<{
  diffFile: diffV2.DiffFile<diffV2.DiffLine[]> | null;
  mode: Mode;
}> = ({ diffFile, mode }) => {
  if (!diffFile) return null;

  const content = diffFile.chunks.reduce<{
    infoLines: React.ReactElement[];
    lines: React.ReactElement[];
  }>(
    (memo, diffChunk, chunkIndex) => {
      memo.infoLines.push(
        <InfoLineHeaderChunk
          key={`info-line-header-${chunkIndex}`}
          diffHeader={diffChunk.header}
          mode={mode}
        />,
      );

      memo.lines.push(
        <LineHeaderChunk
          key={`line-${chunkIndex}`}
          diffHeader={diffChunk.header}
        />,
      );

      diffChunk.lines.forEach((diffLine, lineIndex) => {
        const bgColor = getBgColor(diffLine, mode);

        memo.infoLines.push(
          <InfoLine
            key={`info-line-${chunkIndex}-${lineIndex}`}
            mode={mode}
            diffLine={diffLine}
            bgColor={bgColor}
          />,
        );

        memo.lines.push(
          <Line
            key={`line-${chunkIndex}-${lineIndex}`}
            mode={mode}
            diffLine={diffLine}
            bgColor={bgColor}
          />,
        );
      });

      memo.infoLines.push(
        <Separator key={`info-line-separator-${chunkIndex}`} />,
      );

      memo.lines.push(<Separator key={`line-separator-${chunkIndex}`} />);

      return memo;
    },
    {
      infoLines: [],
      lines: [],
    },
  );

  return (
    <Container>
      <InfoLines>
        <tbody>{content.infoLines}</tbody>
      </InfoLines>
      <Lines>
        <tbody>{content.lines}</tbody>
      </Lines>
    </Container>
  );
};

const InfoLineHeaderChunk: React.FC<{
  diffHeader: diffV2.DiffChunkHeader;
  mode: Mode;
}> = ({ diffHeader, mode }) => {
  return (
    <Header>
      <AddButton>
        <Tooltip title="Add chunk">
          <Icon type={mode === "remove" ? "minus" : "plus"} />
        </Tooltip>
      </AddButton>
      <td></td>
    </Header>
  );
};

const LineHeaderChunk: React.FC<{
  diffHeader: diffV2.DiffChunkHeader;
}> = ({ diffHeader }) => {
  return (
    <Header>
      <td data-type="title">
        {`@@ -${diffHeader.meta.remove.from},${diffHeader.meta.remove.length} +${diffHeader.meta.add.from},${diffHeader.meta.add.length} @@ ${diffHeader.title}`}
      </td>
    </Header>
  );
};

const InfoLine: React.FC<{
  mode: Mode;
  diffLine: diffV2.DiffLine;
  bgColor?: string;
}> = ({ diffLine, mode, bgColor }) => {
  const modeLine = diffLine[mode];

  return (
    <tr>
      <AddButton>
        <Branch if={modeLine !== null && diffLine.changed}>
          <Tooltip title="Add line">
            <Icon type={mode === "remove" ? "minus" : "plus"} />
          </Tooltip>
        </Branch>
      </AddButton>
      <Num bgColor={bgColor}>
        {modeLine !== null
          ? mode === "remove"
            ? diffLine.removeNumLine
            : diffLine.addNumLine
          : " "}
      </Num>
    </tr>
  );
};

const Line: React.FC<{
  mode: Mode;
  diffLine: diffV2.DiffLine;
  bgColor?: string;
}> = ({ mode, diffLine, bgColor }) => {
  const changes =
    diffLine.changed && diffLine.diff.length
      ? diffLine.diff.reduce<React.ReactElement[]>((memo, change, index) => {
          if (!change.removed && !change.added) {
            memo.push(
              <React.Fragment key={index}>{change.value}</React.Fragment>,
            );
          } else if (change.removed && mode === "remove") {
            memo.push(
              <Chunk key={index} bgColor={red[1]}>
                {change.value}
              </Chunk>,
            );
          } else if (change.added && mode === "add") {
            memo.push(
              <Chunk key={index} bgColor={cyan[1]}>
                {change.value}
              </Chunk>,
            );
          }
          return memo;
        }, [])
      : diffLine[mode];

  return (
    <tr>
      <Code bgColor={bgColor}>{changes}</Code>
    </tr>
  );
};

const Separator: React.FC = () => (
  <tr>
    <td></td>
  </tr>
);

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-wrap: nowrap;
`;

const Table = styled.table`
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

const InfoLines = styled(Table)``;

const Lines = styled(Table)`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
`;

const Header = styled.tr`
  background-color: ${geekblue[0]};
  font-weight: bold;

  td[data-type="title"] {
    width: 100vw;
  }
`;

const AddButton = styled.td`
  cursor: pointer;
  color: ${grey[2]};
`;

const Num = styled.td<{ bgColor?: string }>`
  color: ${grey[0]};
  text-align: right;
  background-color: ${({ bgColor }) => bgColor};
`;

const Code = styled.td<{ bgColor?: string }>`
  width: 100%;
  white-space: pre !important;
  background-color: ${({ bgColor }) => bgColor};
`;

const Chunk = styled.span<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  padding: 3px 2px;
`;

function getBgColor(diffLine: diffV2.DiffLine, mode: Mode) {
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
