import * as React from "react";
import { FileDiffLineV2 } from "lib/api-git";
import { cyan, red } from "@ant-design/colors";
import styled from "styled-components";

type Mode = "-" | "+";

export const DiffChunks: React.FC<{
  diffLine: FileDiffLineV2;
  mode: Mode;
}> = ({ diffLine, mode }) => {
  const line = mode === "-" ? diffLine.remove : diffLine.add;
  const chunks = line
    ? line.chunks.map((chunk, index) => {
        switch (chunk[0]) {
          case "-":
            return (
              <Chunk bgColor={red[1]} key={index}>
                {chunk.slice(1)}
              </Chunk>
            );
          case "+":
            return (
              <Chunk bgColor={cyan[1]} key={index}>
                {chunk.slice(1)}
              </Chunk>
            );
          default:
            return (
              <React.Fragment key={index}>{chunk.slice(1)}</React.Fragment>
            );
        }
      })
    : [];

  return <>{chunks}</>;
};

const Chunk = styled.span<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 3px;
  padding: 3px 2px;
`;
