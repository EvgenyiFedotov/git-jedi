import * as React from "react";
import { DiffFile, DiffLine, DiffChunkHeader } from "lib/api-git";
import { cyan, red } from "@ant-design/colors";
import { Icon, Tooltip } from "antd";
import { Branch } from "lib/branch";
import { Change } from "diff";

import {
  Separator,
  Container,
  InfoLines,
  Lines,
  Header,
  AddButton,
  Num,
  Code,
  Chunk,
  getBgColor,
} from "./ui";
import { Mode } from "./types";

export const DiffByMode: React.FC<{
  diffFile: DiffFile<DiffLine[]> | null;
  mode: Mode;
}> = ({ diffFile, mode }) => {
  if (!diffFile) return null;

  const { infoLines, lines } = getContent(diffFile, mode);

  return (
    <Container>
      <InfoLines>
        <tbody>{infoLines}</tbody>
      </InfoLines>
      <Lines>
        <tbody>{lines}</tbody>
      </Lines>
    </Container>
  );
};

const getContent = (diffFile: DiffFile<DiffLine[]>, mode: Mode) => {
  return diffFile.chunks.reduce<{
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
};

const InfoLineHeaderChunk: React.FC<{
  diffHeader: DiffChunkHeader;
  mode: Mode;
}> = ({ diffHeader, mode }) => {
  return (
    <Header>
      <AddButton>
        <Tooltip title="Add chunk">
          <Icon type="plus" />
        </Tooltip>
      </AddButton>
      <td></td>
    </Header>
  );
};

const LineHeaderChunk: React.FC<{
  diffHeader: DiffChunkHeader;
}> = ({ diffHeader: { meta, title } }) => {
  const { remove, add } = meta;

  return (
    <Header>
      <td data-type="title">
        {`@@ -${remove.from},${remove.length} +${add.from},${add.length} @@ ${title}`}
      </td>
    </Header>
  );
};

const InfoLine: React.FC<{
  mode: Mode;
  diffLine: DiffLine;
  bgColor?: string;
}> = ({ diffLine, mode, bgColor }) => {
  const modeLine = diffLine[mode];
  const num = React.useMemo(
    () =>
      modeLine !== null
        ? mode === "remove"
          ? diffLine.removeNumLine
          : diffLine.addNumLine
        : " ",
    [modeLine, mode, diffLine],
  );

  return (
    <tr>
      <AddButton>
        <Branch if={modeLine !== null && diffLine.changed}>
          <Tooltip title="Add line">
            <Icon type="plus" />
          </Tooltip>
        </Branch>
      </AddButton>
      <Num bgColor={bgColor}>{num}</Num>
    </tr>
  );
};

const Line: React.FC<{
  mode: Mode;
  diffLine: DiffLine;
  bgColor?: string;
}> = ({ mode, diffLine, bgColor }) => {
  const changes = React.useMemo(
    () =>
      diffLine.changed && diffLine.diff.length
        ? getChanges(diffLine.diff, mode)
        : diffLine[mode],
    [diffLine, mode],
  );

  return (
    <tr>
      <Code bgColor={bgColor}>{changes}</Code>
    </tr>
  );
};

const getChanges = (diff: Change[], mode: Mode) => {
  return diff.reduce<React.ReactElement[]>((memo, change, index) => {
    if (!change.removed && !change.added) {
      memo.push(<React.Fragment key={index}>{change.value}</React.Fragment>);
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
  }, []);
};
