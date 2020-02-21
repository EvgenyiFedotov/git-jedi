import * as React from "react";
import { FileDiffLine } from "lib/api-git";
import { cyan, red } from "@ant-design/colors";
import styled from "styled-components";
import { Branch } from "lib/branch";

type ChunkType = "-" | "+";

export const DiffChunks: React.FC<{
  diffLine: FileDiffLine;
  type: ChunkType;
}> = ({ diffLine, type }) => {
  const filteredChunks = filterDiffChunks(diffLine.chunks, type);
  const chunks = filteredChunks.map((chunk, index) => {
    switch (chunk[0]) {
      case "-":
        return (
          <RemoveChunk chunk={chunk.slice(1)} diffLine={diffLine} key={index} />
        );
      case "+":
        return (
          <AddChunk chunk={chunk.slice(1)} diffLine={diffLine} key={index} />
        );
      default:
        return <React.Fragment key={index}>{chunk.slice(1)}</React.Fragment>;
    }
  });

  return <>{chunks}</>;
};

const RemoveChunk: React.FC<{ chunk: string; diffLine: FileDiffLine }> = ({
  chunk,
  diffLine,
}) => {
  return (
    <Branch if={diffLine.remove}>
      <Chunk bgColor={red[1]}>{chunk}</Chunk>
      <span>{chunk}</span>
    </Branch>
  );
};

const AddChunk: React.FC<{ chunk: string; diffLine: FileDiffLine }> = ({
  chunk,
  diffLine,
}) => {
  return (
    <Branch if={diffLine.remove}>
      <Chunk bgColor={cyan[1]}>{chunk}</Chunk>
      <span>{chunk}</span>
    </Branch>
  );
};

const Chunk = styled.span<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  padding: 0 2px;
`;

function filterDiffChunks(chunks: string[], type: ChunkType) {
  return chunks.filter((chunk) => {
    switch (chunk[0]) {
      case " ":
      case type:
        return true;
    }

    return false;
  });
}
