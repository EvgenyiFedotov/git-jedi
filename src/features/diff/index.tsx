import * as React from "react";
import { FileDiff, FileDiffChunk, FileDiffLine } from "lib/api-git";
import { Column, Row } from "ui";
import { cyan, red, grey } from "@ant-design/colors";
import { Branch } from "lib/branch";

import { DiffChunks } from "./ui/diff-chunks";

export const Diff: React.FC<{ fileDiff: FileDiff | null }> = ({ fileDiff }) => {
  if (!fileDiff) return null;

  const chunks = fileDiff.chunks.map((diffChunk, index) => (
    <DiffChunk diffChunk={diffChunk} key={index} />
  ));

  return <Column>{chunks}</Column>;
};

const DiffChunk: React.FC<{ diffChunk: FileDiffChunk }> = ({ diffChunk }) => {
  const lines = diffChunk.lines.map((diffLine, index) => (
    <DiffLine diffLine={diffLine} key={index} />
  ));

  return (
    <div style={{ fontFamily: "monospace", fontSize: "small" }}>
      {lines}
      <br />
    </div>
  );
};

const DiffLine: React.FC<{
  diffLine: FileDiffLine;
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
            <DiffChunks diffLine={diffLine} type="-" />
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
            <DiffChunks diffLine={diffLine} type="+" />
          </Branch>
        </div>
      </Row>
    </Row>
  );
};
