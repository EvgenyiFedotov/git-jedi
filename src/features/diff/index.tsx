import * as React from "react";
import { FileDiff, FileDiffChunk, FileDiffLineV2 } from "lib/api-git";
import { Column, Row } from "ui";
import { cyan, red, grey } from "@ant-design/colors";
import { Branch } from "lib/branch";

export const Diff: React.FC<{ fileDiff: FileDiff | null }> = ({ fileDiff }) => {
  if (!fileDiff) return null;

  const chunks = fileDiff.chunks.map((diffChunk, index) => (
    <DiffChunk diffChunk={diffChunk} key={index} />
  ));

  return <Column>{chunks}</Column>;
};

const DiffChunk: React.FC<{ diffChunk: FileDiffChunk }> = ({ diffChunk }) => {
  const lines = diffChunk.linesV2.map((diffLine, index) => (
    <DiffLine
      diffLine={diffLine}
      key={index}
      // numLineRemove={index + diffChunk.header.meta.remove.from}
      // numLineAdd={index + diffChunk.header.meta.add.from}
    />
  ));

  return (
    <div style={{ fontFamily: "monospace", fontSize: "small" }}>
      {lines}
      <br />
    </div>
  );
};

const DiffLine: React.FC<{
  diffLine: FileDiffLineV2;
  // numLineRemove: number;
  // numLineAdd: number;
  // }> = ({ diffLine, numLineRemove, numLineAdd }) => {
}> = ({ diffLine }) => {
  return (
    <Row style={{ flexWrap: "nowrap" }}>
      <Row
        style={{
          width: "50%",
          backgroundColor: diffLine.remove ? red[0] : "",
          flexWrap: "nowrap",
          padding: "0 4px",
        }}
      >
        <div style={{ whiteSpace: "nowrap", color: grey[0] }}>
          <Branch if={diffLine.remove || diffLine.spase}>
            <>{diffLine.removeNumLine}</>
          </Branch>
        </div>
        <div style={{ whiteSpace: "pre" }}>
          <Branch if={diffLine.remove || diffLine.spase}>
            <>{joinChunks(diffLine.chunks, "-", diffLine)}</>
          </Branch>
        </div>
      </Row>
      <Row
        style={{
          width: "50%",
          backgroundColor: diffLine.add ? cyan[0] : "",
          flexWrap: "nowrap",
          padding: "0 4px",
        }}
      >
        <div style={{ whiteSpace: "nowrap", color: grey[0] }}>
          <Branch if={diffLine.add || diffLine.spase}>
            <>{diffLine.addNumLine}</>
          </Branch>
        </div>
        <div style={{ whiteSpace: "pre" }}>
          <Branch if={diffLine.add || diffLine.spase}>
            <>{joinChunks(diffLine.chunks, "+", diffLine)}</>
          </Branch>
        </div>
      </Row>
    </Row>
  );
};

function joinChunks(
  chunks: string[],
  action: string,
  diffLine: FileDiffLineV2,
) {
  return chunks
    .filter((chunk) => {
      switch (chunk[0]) {
        case " ":
        case action:
          return true;
      }

      return false;
    })
    .map((chunk, index) => {
      switch (chunk[0]) {
        case "-":
          return (
            <span
              key={index}
              style={
                diffLine.add
                  ? { backgroundColor: red[1], borderRadius: "3px" }
                  : undefined
              }
            >
              {chunk.slice(1)}
            </span>
          );
        case "+":
          return (
            <span
              key={index}
              style={
                diffLine.remove
                  ? { backgroundColor: cyan[1], borderRadius: "3px" }
                  : undefined
              }
            >
              {chunk.slice(1)}
            </span>
          );
      }

      return <React.Fragment key={index}>{chunk.slice(1)}</React.Fragment>;
    });
}
